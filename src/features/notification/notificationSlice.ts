import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  type: "budget_alert" | "info" | "warning" | "error";
  title: string;
  message: string;
  category?: string;
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, "id" | "timestamp" | "read">>) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);

      // Keep only last 20 notifications
      if (state.notifications.length > 20) {
        state.notifications.pop();
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addBudgetAlerts: (
  state,
  action: PayloadAction<{
    alerts: Array<{
      message: string;
      type: "category" | "overall";
      category?: string;
    }>;
    month: number;
    year: number;
  }>
) => {
  const { alerts } = action.payload;

  alerts.forEach((alert) => {
    // check if same alert already exists
    const exists = state.notifications.some(
      (n) =>
        n.type === "budget_alert" &&
        n.message === alert.message &&
        n.category === alert.category &&
        n.title === (alert.type === "overall" ? "Overall Budget Alert" : `${alert.category} Alert`)
    );

    if (!exists) {
      const notification: NotificationItem = {
        id: `${Date.now()}-${Math.random()}`,
        type: "budget_alert",
        title: alert.type === "overall" ? "Overall Budget Alert" : `${alert.category} Alert`,
        message: alert.message,
        category: alert.category,
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
    }
  });

  // Keep only last 20 notifications
  if (state.notifications.length > 20) {
    state.notifications.splice(20);
  }
}

  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  addBudgetAlerts,
} = notificationSlice.actions;

export default notificationSlice.reducer;
