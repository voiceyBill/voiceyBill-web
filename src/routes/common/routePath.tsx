export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const isPublicRoute = (pathname: string): boolean => {
  return Object.values(PUBLIC_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  VERIFY_OTP: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_RESET_OTP: "/verify-reset-password",
  SET_NEW_PASSWORD: "/set-new-password",
  RESET_PASSWORD: "/reset-password",
};

export const PUBLIC_ROUTES = {
  HOME: "/",
};

export const PROTECTED_ROUTES = {
  OVERVIEW: "/overview",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
  BUDGET: "/budget",
  SETTINGS: "/settings",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_BILLING: "/settings/billing",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_CATEGORIES: "/settings/categories",
};
