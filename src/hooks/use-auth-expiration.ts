import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateCredentials } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/features/auth/authAPI";

const useAuthExpiration = () => {
  const { accessToken, expiresAt, refreshToken: storedRefreshToken } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshMutation();

  useEffect(() => {
    const handleLogout = () => {

      dispatch(logout());
    };

    const handleTokenRefresh = async () => {
      try {

        if (!storedRefreshToken) {
          throw new Error("No refresh token stored");
        }

        const { accessToken, expiresAt, refreshToken: newRefreshToken } = await refreshToken({
          refreshToken: storedRefreshToken
        }).unwrap();
        dispatch(updateCredentials({ accessToken, expiresAt, refreshToken: newRefreshToken || storedRefreshToken }));


      } catch (error) {
        console.error("Token refresh failed, logging out...", error);
        handleLogout();
      }
    };

    if (accessToken && expiresAt) {
      const currentTime = Date.now();
      const timeUntilExpiration = expiresAt - currentTime;

      // Refresh slightly BEFORE it expires
      const bufferTime = 60 * 1000;

      if (timeUntilExpiration <= bufferTime) {
        // Token is already expired or very close to expiring
        handleTokenRefresh();
      } else {
        // Set a timeout to REFRESH the token right before it expires
        const timer = setTimeout(handleTokenRefresh, timeUntilExpiration - bufferTime);
        // Cleanup the timer on component unmount or token change
        return () => clearTimeout(timer);
      }
    }
  }, [accessToken, dispatch, expiresAt, refreshToken, storedRefreshToken]);
};

export default useAuthExpiration;
