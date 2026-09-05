import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorServices } from "./doctor.service";

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {
	// Cast req.files to access the fields cleanly
	const files = req.files as { [fieldname: string]: Express.Multer.File[] };

	// Extract the single resume file (it will be the first item in its array)
	const resume = files?.["resume"] ? files["resume"][0] : null;

	// Extract the array of additional files
	const additionalFiles = files?.["additionalFiles"] || [];
	const payload = req.body;

	const result = await DoctorServices.applyAsDoctor(
		payload,
		resume,
		additionalFiles,
	);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Applied As Doctor Successfully.",
		data: result,
	});
});

const verifyDoctorEmail = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await DoctorServices.verifyDoctorEmail(payload);
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Doctor Eamil Verified Successfully.",
		data: result,
	});
});

export const DoctorController = {
	applyAsDoctor,
	verifyDoctorEmail,
};
