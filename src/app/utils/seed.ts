import bcrypt from "bcryptjs";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import config from "../config";

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExist = await prisma.user.findFirst({
			where: {
				role: Role.SUPER_ADMIN,
			},
		});

		if (isSuperAdminExist) {
			console.log("Super Admin Already Exist!");
			return;
		}
		const name = config.super_admin_name;
		const email = config.super_admin_email;
		const password = config.super_admin_password;
		if (!name || !email || !password) {
			throw new Error(
				"Super Admin Name, Email or Password is not defined in .env file",
			);
		}
		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const superAdmin = await prisma.user.create({
			data: {
				name,
				email,
				role: Role.SUPER_ADMIN,
				password: hashedPassword,
				needPasswordChange: false,
				emailVerified: true,
			},
		});
		console.log("Super Admin Created :", superAdmin);
	} catch (error) {
		console.log("Error Seeding Super Admin : ", error);
		if (config.super_admin_email) {
			await prisma.user.delete({
				where: {
					email: config.super_admin_email,
				},
			});
		}
	}
};

export const seedAdmin = async () => {
	try {
		const name = config.tester_admin_name;
		const email = config.tester_admin_email;
		const password = config.tester_admin_password;
		if (!name || !email || !password) {
			throw new Error(
				"Tester Admin Name, Email or Password is not defined in .env file",
			);
		}
		const isAdminExist = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (isAdminExist) {
			console.log("Admin Already Exist!");
			return;
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const admin = await prisma.user.create({
			data: {
				name,
				email,
				role: Role.ADMIN,
				password: hashedPassword,
				needPasswordChange: false,
				emailVerified: true,
			},
		});
		console.log("Tester Admin Created :", admin);
	} catch (error) {
		console.log("Error Seeding Admin : ", error);
		if (config.tester_admin_email) {
			await prisma.user.delete({
				where: {
					email: config.tester_admin_email,
				},
			});
		}
	}
};

export const seedDoctor = async () => {
	try {
		const name = config.tester_doctor_name;
		const email = config.tester_doctor_email;
		const password = config.tester_doctor_password;
		if (!name || !email || !password) {
			throw new Error(
				"Tester Doctor Name, Email or Password is not defined in .env file",
			);
		}
		const isDoctorExist = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (isDoctorExist) {
			console.log("Doctor Already Exist!");
			return;
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const doctor = await prisma.user.create({
			data: {
				name,
				email,
				role: Role.DOCTOR,
				password: hashedPassword,
				needPasswordChange: false,
				emailVerified: true,
				doctor: {
					create: {
						email,
						name,
						experienceYears: 5,
						licenseNumber: "BD_D786",
						qualifications: "MBBS",
						specialization: "Neurology",
					},
				},
			},
			include: {
				doctor: true,
			},
		});
		console.log("Tester Doctor Created :", doctor);
	} catch (error) {
		console.log("Error Seeding Doctor : ", error);
		if (config.tester_doctor_email) {
			await prisma.user.delete({
				where: {
					email: config.tester_doctor_email,
				},
			});
		}
	}
};
