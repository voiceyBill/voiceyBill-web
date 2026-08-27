import { createApi, fetchBaseQuery, type FetchBaseQueryError, } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { logout } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

const isUnauthorizedError = (error: FetchBaseQueryError | undefined) => {
  if (!error) return false;

  if (error.status === 401) {
    return true;
  }

  if (
    error.status === "PARSING_ERROR" &&
    error.originalStatus === 401
  ) {
    return true;
  }

  return false;
};

const baseQueryWithLogout = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (isUnauthorizedError(result.error)) {
    api.dispatch(logout());
  }

  return result;
};
export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: baseQueryWithLogout,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: ["transactions", "analytics", "billingSubscription", "categories", "budget"], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
