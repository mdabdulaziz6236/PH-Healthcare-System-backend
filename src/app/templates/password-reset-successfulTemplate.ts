export const passwordResetSuccessfulTemplate = () => {
	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Password Reset Successful</title>
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
				<div style="padding: 40px 30px; text-align: center;">

					<!-- Success Icon -->
					<div style="
						width: 70px;
						height: 70px;
						margin: 0 auto 20px;
						background-color: #dcfce7;
						border-radius: 50%;
						line-height: 70px;
						font-size: 35px;
						color: #16a34a;
					">
						✓
					</div>

					<h2 style="
						margin: 0 0 15px;
						color: #111827;
						font-size: 24px;
					">
						Password Reset Successful
					</h2>

					<p style="
						margin: 0 auto;
						max-width: 480px;
						color: #4b5563;
						font-size: 15px;
						line-height: 1.7;
					">
						Your password has been successfully reset.
						You can now use your new password to securely
						sign in to your account.
					</p>

					<!-- Success Message -->
					<div style="
						margin: 30px 0;
						padding: 18px;
						background-color: #f0fdfa;
						border: 1px solid #99f6e4;
						border-radius: 8px;
						text-align: left;
					">
						<p style="
							margin: 0;
							color: #115e59;
							font-size: 14px;
							line-height: 1.6;
						">
							<strong>Your account is secure.</strong><br />
							Your old password can no longer be used to
							access your account.
						</p>
					</div>

					<p style="
						color: #6b7280;
						font-size: 14px;
						line-height: 1.6;
					">
						If you made this change, no further action is required.
					</p>

					<p style="
						color: #dc2626;
						font-size: 14px;
						line-height: 1.6;
					">
						<strong>Didn't reset your password?</strong><br />
						Please contact our support team immediately.
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