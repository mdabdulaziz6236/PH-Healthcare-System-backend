import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: z.ZodObject) => {
	return catchAsync((req: Request, res: Response, next: NextFunction) => {
		let payload = req.body ?? {};

		if (req.body && typeof req.body.data === "string") {
			payload = JSON.parse(req.body.data);
		}

		const result = zodSchema.safeParse(payload);
		if (!result.success) {
			console.log(result.error);
			throw new Error(result.error.issues[0].message);
		}
		req.body = result.data;
		next();
	});
};
