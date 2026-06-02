import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import VerifyEmail from "@/pages/auth/verify-email";
import ForgotPassword from "@/pages/auth/forgot-password";
import VerifyResetPassword from "@/pages/auth/verify-reset-password";
import SetNewPassword from "@/pages/auth/set-new-password";
import ResetPassword from "@/pages/auth/reset-password";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Budget from "@/pages/budget";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import Billing from "@/pages/settings/billing";
import Security from "@/pages/settings/security";
import Categories from "@/pages/settings/categories";

export const publicRoutePaths = [
  { path: PUBLIC_ROUTES.HOME, element: <Home /> },
];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.VERIFY_OTP, element: <VerifyEmail /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: AUTH_ROUTES.VERIFY_RESET_OTP, element: <VerifyResetPassword /> },
  { path: AUTH_ROUTES.SET_NEW_PASSWORD, element: <SetNewPassword /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.BUDGET, element: <Budget /> },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <Settings />,
    children: [
      { index: true, element: <Account /> }, // Default route
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
      { path: PROTECTED_ROUTES.SETTINGS_BILLING, element: <Billing /> },
      { path: PROTECTED_ROUTES.SETTINGS_SECURITY, element: <Security /> },
      { path: PROTECTED_ROUTES.SETTINGS_CATEGORIES, element: <Categories /> },
    ],
  },
];
