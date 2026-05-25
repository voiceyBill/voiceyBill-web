export interface NotificationType {
  _id: string;
  transactionId: string;
  type: "INCOME" | "EXPENSE";
  title: string;
  amount: number;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationType[];
}

export interface GetUnreadCountResponse {
  count: number;
}
