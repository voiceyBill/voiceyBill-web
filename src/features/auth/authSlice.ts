import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
  reportSetting: ReportSetting | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isVerified?: boolean;
  baseCurrency?: string;
}

interface ReportSetting {
  userId: string;
  frequency?: string;
  isEnabled: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("token") || null,
  expiresAt: null,
  user: null,
  reportSetting: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
      state.reportSetting = action.payload.reportSetting;

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        action.payload.accessToken
      );
    },

    updateCredentials: (state, action) => {
      const {
        accessToken,
        expiresAt,
        user,
        reportSetting,
      } = action.payload;

      if (accessToken !== undefined) {
        state.accessToken = accessToken;

        // UPDATE TOKEN
        localStorage.setItem("token", accessToken);
      }

      if (expiresAt !== undefined) {
        state.expiresAt = expiresAt;
      }

      if (user !== undefined) {
        state.user = { ...state.user, ...user };
      }

      if (reportSetting !== undefined) {
        state.reportSetting = {
          ...state.reportSetting,
          ...reportSetting,
        };
      }
    },

    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      state.reportSetting = null;

      // REMOVE TOKEN
      localStorage.removeItem("token");
    },
  },
});

export const {
  setCredentials,
  updateCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;