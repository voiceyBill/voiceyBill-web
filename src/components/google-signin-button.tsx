import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import "./google-signin-button.css";

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const GoogleSignInButton = ({
  onSuccess,
  onError,
  isLoading = false,
  className = "",
}: GoogleSignInButtonProps) => {
  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse?.credential) {
      onSuccess(credentialResponse.credential);
    } else {
      onError("Failed to get Google ID token. Please try again.");
    }
  };

  const handleGoogleError = () => {
    onError("Failed to sign in with Google. Please try again.");
  };

  return (
    <div className={`w-full ${className}`}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />

      {isLoading && (
        <p className="loading-text">
          Loading...
        </p>
      )}
    </div>
  );
};

interface GoogleSignInProviderProps {
  children: React.ReactNode;
}

export const GoogleSignInProvider = ({
  children,
}: GoogleSignInProviderProps) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.warn(
      "VITE_GOOGLE_CLIENT_ID environment variable is not set. Google Sign-In will not work."
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      {children}
    </GoogleOAuthProvider>
  );
};
