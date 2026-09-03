import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const buffer = req.file?.buffer;
	if (!buffer) {
        throw new Error("No file uploaded");
    }
   const result=  await UserServices.uploadProfileImage(buffer as Buffer , userId!);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Image Uploaded Successfully",
		data: result,
	});
});

export const UserController = {
	uploadProfileImage,
};
