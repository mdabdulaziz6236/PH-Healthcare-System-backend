import {
	AppointmentStatus,
	PaymentStatus,
} from "../../../../generated/prisma/enums";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/checkAuth";

const bookAppointment = async (payload: any, user: RequestUser) => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		// business logics

		const appointment = await tx.appointment.create({
			data: {
				status: AppointmentStatus.PENDING,
			},
		});

		const bkashIdToken = await getBkashIdToken();
		if (!bkashIdToken) {
			throw new Error("No Bkash Acess token Found!");
		}

		const bkashCreatePaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					// agreementID: "TokenizedMerchant01L3IKB6H1565072174986", // appointment id
					mode: "0011",
					payerReference: user.email, // user email or phone number
					callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
					// merchantAssociationInfo: "MI05MID54RF09123456One",
					amount: "1200",
					currency: "BDT",
					intent: "sale",
					merchantInvoiceNumber: appointment.id, // appointmentId
				}),
			},
		);

		const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();
		// payment model cereate
		await tx.payment.create({
			data: {
				merchatInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
				appointmentId: appointment.id,
				amount: "1200",
				getwayResponse: bkashCreatePaymentResult,
				bkashPaymentId: bkashCreatePaymentResult.paymentID,
				payerReference: user.email,
			},
		});
		return {
			paymentUrl: bkashCreatePaymentResult.bkashURL,
		};
	});
	return transactionResult;
};

const payAppointment = async (payload: any, user: RequestUser) => {
	const appointmentId = payload.appointmentId;
	const existingAppointment = await prisma.appointment.findUnique({
		where: {
			id: appointmentId,
		},
	});
	if (!existingAppointment) {
		throw new Error("Appointment Does Not Exists");
	}
	if (existingAppointment.status !== "PENDING") {
		throw new Error("Appointment is Not Pending");
	}
	// if(existingAppointment.status === "CANCELED" || existingAppointment.status ==='ONGOING' || existingAppointment.status=== "COMPLETED"){
	// 	throw new Error(` Appointment is already ${existingAppointment.status.toLowerCase}`)
	// }

	const bkashIdToken = await getBkashIdToken();
	if (!bkashIdToken) {
		throw new Error("No Bkash Acess token Found!");
	}

	const bkashCreatePaymentResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				// agreementID: "TokenizedMerchant01L3IKB6H1565072174986", // appointment id
				mode: "0011",
				payerReference: user.email, // user email or phone number
				callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
				// merchantAssociationInfo: "MI05MID54RF09123456One",
				amount: "1200",
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: existingAppointment.id, // appointmentId
			}),
		},
	);

	const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();
	await prisma.payment.update({
		where: {
			appointmentId: existingAppointment.id,
		},
		data: {
			merchatInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
			getwayResponse: bkashCreatePaymentResult,
			bkashPaymentId: bkashCreatePaymentResult.paymentID,
		},
	});
	return {
		paymentUrl: bkashCreatePaymentResult.bkashURL,
	};
};

const bookAppointmentCallback = async (query: Record<string, any>) => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		const paymentId = query.paymentID;
		if (!paymentId) {
			throw new Error("Payment Id Missing");
		}
		const status = query.status;
		if (!status) {
			throw new Error("Payment Status Missing");
		}
		// if (status !== "success") {
		// 	return {
		// 		statusCode: "9999",
		// 		statusMessage: `Payment failed or cancelled by user. Status: ${status}`,
		// 	};
		// }
		const bkashIdToken = await getBkashIdToken();
		if (!bkashIdToken) {
			throw new Error("No Bkash Acess token Found!");
		}

		const executedPaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					paymentID: paymentId,
				}),
			},
		);
		const executedPaymentResult = await executedPaymentResponse.json();
		if (status === "success") {
			await tx.appointment.update({
				where: {
					id: executedPaymentResult.merchantInvoiceNumber,
				},
				data: {
					status: AppointmentStatus.CONFIRMED,
				},
			});

			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.PAID,
					bkashTrxId: executedPaymentResult.trxID,
					paidAt: executedPaymentResult.paymentExecuteTime,
					getwayResponse: executedPaymentResult,
				},
			});

			return {
				redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
			};
		} else if (status === "failure") {
			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.FAILED,
					getwayResponse: executedPaymentResult,
				},
			});

			return {
				redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=failure`,
			};
		} else if (status === "cancel") {
			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.CANCELLED,
					getwayResponse: executedPaymentResult,
				},
			});
			return {
				redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=cancel`,
			};
		} else {
			return {
				redirectUrl: `${config.frontend_url}/dashboard/my-appointments?error=payment-failed`,
			};
		}
	});
	return transactionResult;
};

export const AppointmentService = {
	bookAppointment,
	payAppointment,
	bookAppointmentCallback,
};
