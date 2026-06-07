export interface AuthUser {
	id: string;
	name: string;
	email: string;
	profilePicture?: string | null;
	isVerified?: boolean;
	baseCurrency?: string;
}

export interface AuthReportSetting {
	userId: string;
	frequency?: string;
	isEnabled: boolean;
}

export interface RegisterResponse {
	message: string;
	data?: {
		user: AuthUser;
		verificationRequired: boolean;
	};
}

export interface LoginResponse {
	message?: string;
	user: AuthUser;
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	reportSetting: AuthReportSetting | null;
}

export interface VerifyOtpRequest {
	email: string;
	otp: string;
}

export interface ResendOtpRequest {
	email: string;
}

export interface VerifyOtpResponse {
	message?: string;
	data: {
		user: AuthUser;
		accessToken: string;
		refreshToken?: string;
		expiresAt: number;
		reportSetting: AuthReportSetting | null;
		verified: boolean;
	};
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ForgotPasswordResponse {
	message: string;
}

export interface ResetPasswordRequest {
	email: string;
	otp: string;
	password: string;
}

export interface ResetPasswordResponse {
	message: string;
}

export interface ErrorResponse {
	data?: {
		message?: string;
		errorCode?: string;
	};
}

export interface RefreshTokenResponse {
	accessToken: string;
	expiresAt: number;
	refreshToken?: string;
}
