import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";

const bookAppointment = async () => {
	// business logics
	const bkashIdToken = await getBkashIdToken();
	console.log("bkashIdToken", bkashIdToken);
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
				payerReference: "01111111111", // user email or phone number
				callbackURL: `${config.bkash_callback_url}/appointment/book-appointment/payment/callback`,
				// merchantAssociationInfo: "MI05MID54RF09123456One",
				amount: "1200",
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: `Inv${Date.now()}`, //appointment id
			}),
		},
	);

	const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();
	return bkashCreatePaymentResult;
};

const bookAppointmentCallback = async (query: Record<string, any>) => {
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
		return {
			executedPaymentResult,
			transactionId: executedPaymentResult.trxID,
			redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
		};
	}
	if (status === "failure") {
		return {
			executedPaymentResult,
			redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=failure`,
		};
	}
	if (status === "cancel") {
		return {
			executedPaymentResult,
			redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=cancel`,
		};
	}

	return {
		executedPaymentResult,
		redirectUrl: `${config.frontend_url}/dashboard/my-appointments`,
	};
};

export const AppointmentSevice = {
	bookAppointment,
	bookAppointmentCallback,
};
