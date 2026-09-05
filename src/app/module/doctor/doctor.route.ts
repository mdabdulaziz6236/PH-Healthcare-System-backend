import { Router } from "express";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { DoctorController } from "./doctor.controller";
import {
	ApplyAsDoctorValidationZodSchema,
	DoctorEmailVerifyZodSchema,
} from "./doctor.validation";

const router = Router();

router.post(
	"/apply-as-doctor",
	upload.fields([
		{ name: "resume", maxCount: 1 },
		{ name: "additionalFiles", maxCount: 10 },
	]),
	validateRequest(ApplyAsDoctorValidationZodSchema),
	DoctorController.applyAsDoctor,
);

router.post(
	"/apply-as-doctor/verify-email",
	validateRequest(DoctorEmailVerifyZodSchema),
	DoctorController.verifyDoctorEmail,
);

export const DoctorRoutes = router;
