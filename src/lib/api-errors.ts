/**
 * Extract error message from various error formats
 */
type APIError = {
  data?: { message?: string };
  status?: "FETCH_ERROR" | "PARSING_ERROR";
  message?: string;
};

export const getErrorMessage = (error: APIError | unknown): string => {
  // RTK Query error format
  if (typeof (error as APIError)?.data?.message === "string") {
    return (error as APIError).data!.message!;
  }

  // Network/CORS error
  if ((error as APIError)?.status === "FETCH_ERROR") {
    return "Network error. Please check your connection.";
  }

  // Parsing error
  if ((error as APIError)?.status === "PARSING_ERROR") {
    return "Server error. Invalid response format.";
  }

  // Generic error message
  if (typeof (error as APIError)?.message === "string") {
    return (error as APIError).message!;
  }

  // Fallback
  return "An unexpected error occurred. Please try again.";
};
