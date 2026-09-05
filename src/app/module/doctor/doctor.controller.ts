import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorServices } from "./doctor.service";

const applyAsDoctor = catchAsync(async (req: Request, res: Response) => {

    // Cast req.files to access the fields cleanly
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  // Extract the single resume file (it will be the first item in its array)
  const resume = files?.['resume'] ? files['resume'][0] : undefined;
  
  // Extract the array of additional files
  const additionalFiles = files?.['additionalFiles'] || [];
  
  const data = JSON.parse(req.body.data);



	const result = await DoctorServices.applyAsDoctor();
	console.log({
		resume,additionalFiles,
		data,
	});

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Applied As Doctor Successfully.",
		data: {},
	});
});

export const DoctorController = {
	applyAsDoctor,
};
