export const forgotPasswordTemplate = (otp: string) => {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Password Reset</title>
	</head>

	<body style="
		margin: 0;
		padding: 0;
		background-color: #f4f7fb;
		font-family: Arial, Helvetica, sans-serif;
	">

		<div style="
			max-width: 600px;
			margin: 40px auto;
			background-color: #ffffff;
			border-radius: 12px;
			overflow: hidden;
			border: 1px solid #e5e7eb;
		">

			<!-- Header -->
			<div style="
				background-color: #0d9488;
				padding: 28px 20px;
				text-align: center;
				color: #ffffff;
			">
				<h1 style="
					margin: 0;
					font-size: 26px;
				">
					Digital Healthcare Platform
				</h1>

				<p style="
					margin: 8px 0 0;
					font-size: 14px;
					opacity: 0.9;
				">
					Secure Healthcare Management
				</p>
			</div>

			<!-- Content -->
			<div style="padding: 35px 30px;">

				<h2 style="
					margin-top: 0;
					color: #111827;
					font-size: 22px;
				">
					Password Reset Request
				</h2>

				<p style="
					color: #4b5563;
					font-size: 15px;
					line-height: 1.7;
				">
					We received a request to reset your password.
					Please use the One-Time Password (OTP) below
					to continue.
				</p>

				<!-- OTP Box -->
				<div style="
					margin: 30px 0;
					padding: 24px;
					background-color: #f0fdfa;
					border: 2px dashed #0d9488;
					border-radius: 10px;
					text-align: center;
				">

					<p style="
						margin: 0 0 10px;
						color: #64748b;
						font-size: 13px;
						font-weight: bold;
						text-transform: uppercase;
						letter-spacing: 1px;
					">
						Your OTP
					</p>

					<!-- Selectable OTP -->
					<div style="
						font-size: 36px;
						font-weight: bold;
						letter-spacing: 10px;
						color: #0f766e;
						user-select: all;
						-webkit-user-select: all;
					">
						${otp}
					</div>

					<p style="
						margin: 12px 0 0;
						color: #64748b;
						font-size: 13px;
					">
						You can select and copy this code.
					</p>
				</div>

				<!-- Expiration Warning -->
				<div style="
					background-color: #fff7ed;
					border-left: 4px solid #f97316;
					padding: 14px 16px;
					margin-bottom: 25px;
				">
					<p style="
						margin: 0;
						color: #9a3412;
						font-size: 14px;
						line-height: 1.6;
					">
						<strong>Important:</strong> This OTP will expire
						in <strong>5 minutes</strong>.
					</p>
				</div>

				<p style="
					color: #6b7280;
					font-size: 14px;
					line-height: 1.6;
				">
					For your security, never share this OTP with anyone,
					including our support team.
				</p>

				<p style="
					color: #6b7280;
					font-size: 14px;
					line-height: 1.6;
				">
					If you did not request a password reset, please ignore
					this email. Your account will remain secure.
				</p>

			</div>

			<!-- Footer -->
			<div style="
				padding: 20px 30px;
				background-color: #f8fafc;
				border-top: 1px solid #e5e7eb;
				text-align: center;
			">

				<p style="
					margin: 0 0 8px;
					color: #475569;
					font-size: 13px;
					font-weight: bold;
				">
					Digital Healthcare Platform
				</p>

				<p style="
					margin: 0;
					color: #94a3b8;
					font-size: 12px;
					line-height: 1.5;
				">
					Backend API for a digital healthcare platform supporting
					doctor management, appointments, payments, consultations,
					authentication, and digital prescriptions.
				</p>

				<p style="
					margin: 15px 0 0;
					color: #94a3b8;
					font-size: 11px;
				">
					This is an automated email. Please do not reply.
				</p>

			</div>

		</div>

	</body>
	</html>
	`;
};