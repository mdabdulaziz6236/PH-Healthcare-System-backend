import bcrypt from "bcryptjs";
import type { UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { Role } from "../../../../generated/prisma/enums";
import config from "../../config";
import { cloudinary } from "../../lib/cloudinary";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import type { IApplyAsDoctorPayload } from "./doctor.interface";
import type { IVerifyEmailPayload } from "../auth/auth.interface";

const applyAsDoctor = async (
	payload: IApplyAsDoctorPayload,
	resume: Express.Multer.File | null,
	additionalFiles: Express.Multer.File[],
) => {
	const email = payload.user.email;
	const isUserExists = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});
	if (isUserExists) {
		throw new Error("User Already Exists With This Email");
	}

	const resumeUploadResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
					},
					async (error, result) => {
						if (error) {
							return reject(error);
						}
						if (!result) {
							return reject(new Error("No result returned from Cloudinary"));
						}
						resolve(result);
					},
				)
				.end(resume?.buffer);
		},
	);

	const additionalFilesUploadResults = await Promise.all(
		additionalFiles.map((file) => {
			return new Promise<UploadApiResponse>((resolve, reject) => {
				cloudinary.uploader
					.upload_stream({ resource_type: "auto" }, (error, result) => {
						if (error) {
							return reject(error);
						}
						if (!result) {
							return reject(new Error("No result returned from Cloudinary"));
						}
						resolve(result);
					})
					.end(file.buffer);
			});
		}),
	);

	const randomDoctorPassword = Math.random().toString(36).slice(-8);
	const hashedPassword = await bcrypt.hash(
		randomDoctorPassword,
		Number(config.bcrypt_salt_rounds),
	);

	const doctorApplication = await prisma.user.create({
		data: {
			...payload.user,
			password: hashedPassword,
			role: Role.DOCTOR,
			needPasswordChange: true,

			doctor: {
				create: {
					name: payload.user.name,
					email: email,
					...payload.doctor,
					resume: resumeUploadResult.secure_url,
					resumePublicId: resumeUploadResult.public_id,
					additionalFiles: additionalFilesUploadResults.map((file) => ({
						url: file.secure_url,
						publicId: file.public_id,
					})),
				},
			},
		},
		include: {
			doctor: true,
		},
	});

	const expirationSeconds = 60 * 60; // 1 hour in seconds
	const otpKey = `doctor-application-otp:${payload.user.email}`;
	const otpValue = crypto.randomInt(100000, 1000000).toString();
	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/registration-user-otp.ejs",
	);
	const html = await ejs.renderFile(templatePath, {
		otp: otpValue,
		name: payload.user.name,
		email,
		expirationTimeInMinutes: expirationSeconds,
	});
	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Doctor Application - Email Verification",
		html,
	});

	return doctorApplication;
};

const verifyDoctorEmail = async (payload: IVerifyEmailPayload) => {
	const { otp } = payload;
	const email = payload.email.trim().toLowerCase();

	const existingUser = await prisma.user.findUnique({
		where: { email, role: Role.DOCTOR },
	});
	if (!existingUser) {
		throw new Error("User Doesn't Exist");
	}
	if (existingUser?.emailVerified) {
		throw new Error("Email Already Verified");
	}

	if (existingUser?.status === "BLOCKED") {
		throw new Error("User is Blocked!");
	}

	if (existingUser?.status === "DELETED" || existingUser?.isDeleted) {
		throw new Error("User is Deleted!");
	}

	const otpKey = `doctor-application-otp:${email}`;
	const redisOtp = await redisClient.get(otpKey);
	if (!redisOtp) {
		throw new Error("OTP Expired.");
	}
	if (redisOtp !== otp) {
		throw new Error("OTP Does Not Match");
	}

	await redisClient.del(otpKey);

	const verifiedUser = await prisma.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			emailVerified: true,
		},
		omit: {
			password: true,
		},
		include: {
			doctor: true,
		},
	});

	return verifiedUser;
};

export const DoctorServices = {
	applyAsDoctor,
	verifyDoctorEmail,
};
