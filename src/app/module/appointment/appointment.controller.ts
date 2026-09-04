import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppointmentSevice } from "./appointment.service";

const bookAppointment = catchAsync(async (req: Request, res: Response) => {
	const result = await AppointmentSevice.bookAppointment();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Success",
		data: result,
	});
});

const bookAppointmentCallback = catchAsync(
	async (req: Request, res: Response) => {
		console.log(req.query, "req.query");
		const result = AppointmentSevice.bookAppointmentCallback();
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Success",
			data: result,
		});
	},
);

export const AppointmentController = {
	bookAppointment,
	bookAppointmentCallback,
};
