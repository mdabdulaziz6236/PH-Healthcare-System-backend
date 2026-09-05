import { z } from "zod";

export const ApplyAsDoctorValidationZodSchema = z.object({
	user: z.object({
		name: z.string().trim().min(2, "Name is required"),
		email: z.string().email("Invalid email address").trim().toLowerCase(),
	}),
	doctor: z.object({
		address: z.string().trim().min(5, "Address is required"),
		specialization: z.string().trim().min(2, "Specialization is required"),
		licenseNumber: z.string().trim().min(1, "License number is required"),
		qualifications: z.string().trim().min(1, "Qualifications are required"),
		experienceYears: z
			.number()
			.int()
			.nonnegative("Experience must be a positive integer"),
		bio: z
			.string()
			.trim()
			.max(500, "Bio cannot exceed 500 characters")
			.optional(),
		consultrationFee: z
			.number()
			.positive("Consultation fee must be greater than 0"),
		contuctNumber: z
			.string()
			.trim()
			.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
	}),
});

export const DoctorEmailVerifyZodSchema = z.object({
	email: z.email(),
	otp: z.string().length(6),
});
