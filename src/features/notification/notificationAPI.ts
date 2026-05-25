import { apiClient } from "@/app/api-client";
import type {
  GetNotificationsResponse,
  GetUnreadCountResponse,
} from "./notificationType";

export const notificationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => ({
        url: "/notification/all",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    getUnreadCount: builder.query<GetUnreadCountResponse, void>({
      query: () => ({
        url: "/notification/unread-count",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notification/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
