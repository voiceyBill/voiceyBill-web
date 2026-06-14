import { apiClient } from "@/app/api-client";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResendOtpRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenResponse
} from "./authType";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, Record<string, unknown>>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, Record<string, unknown>>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<{ message: string }, ResendOtpRequest>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    googleLogin: builder.mutation<LoginResponse, { idToken: string }>({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
    }),

    //skip
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refresh: builder.mutation<RefreshTokenResponse,{refreshToken:string}>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
