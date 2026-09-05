import { Router } from "express";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { DoctorController } from "./doctor.controller";
import { ApplyAsDoctorValidationZodSchema } from "./doctor.validation";

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

export const DoctorRoutes = router;
