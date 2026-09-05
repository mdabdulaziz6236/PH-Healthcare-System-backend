import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
	"/book-appointment",
	auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
	AppointmentController.bookAppointment,
);

// book appointment payment callback url
router.get(
	"/book-appointment/payment/callback",
	AppointmentController.bookAppointmentCallback,
);

export const AppointmentRoutes = router;
