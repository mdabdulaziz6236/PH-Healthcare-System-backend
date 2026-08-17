import z from "zod";

 const PatientRegistraitonZodSchema = z.object({
	name: z.string().min(3).max(20),
	email: z.email(),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be at most 32 characters long")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one number")
		.regex(/[^A-Za-z0-9]/, {
			message: "Password must contain at least one special character",
		}),
	patient: z
		.object({
			contactNumber: z.string().optional(),
		})
		.optional(),
});


export const PatientValidation = {
    PatientRegistraitonZodSchema
}