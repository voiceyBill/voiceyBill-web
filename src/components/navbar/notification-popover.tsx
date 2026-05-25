import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useTypedSelector } from "@/app/hook";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
} from "@/features/notification/notificationAPI";
import { formatCurrency } from "@/lib/format-currency";

const NotificationPopover = () => {
  const { accessToken } = useTypedSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const {
    data: notificationsData,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: unreadData,
    refetch: refetchUnreadCount,
  } = useGetUnreadCountQuery(undefined, {
    skip: !accessToken,
  });

  const [markAllAsRead] = useMarkAllNotificationsReadMutation();

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notificationsData?.notifications ?? [];

  useEffect(() => {
    if (!accessToken || !import.meta.env.VITE_API_URL) {
      return;
    }

    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
    let source: EventSource | null = null;
    let cancelled = false;

    const openStream = async () => {
      try {
        const ticketResponse = await fetch(`${baseUrl}/auth/sse-ticket`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!ticketResponse.ok) {
          return;
        }

        const ticketData = await ticketResponse.json();
        const ticket = ticketData.ticket as string;
        if (!ticket) {
          return;
        }

        if (cancelled) {
          return;
        }

        source = new EventSource(`${baseUrl}/notification/stream?ticket=${encodeURIComponent(ticket)}`);

        source.onopen = () => {
          console.debug("SSE connected for notifications");
          // Ensure we have the latest data as soon as the stream is ready
          refetchNotifications();
          refetchUnreadCount();
        };

        source.addEventListener("notification-created", (e: MessageEvent) => {
          try {
            console.debug("SSE event received:", e.data);
          } catch (err) {
            console.debug("SSE event received (no data)");
          }
          refetchNotifications();
          refetchUnreadCount();
        });

        source.onerror = (err) => {
          console.warn("SSE connection error", err);
          if (source) {
            source.close();
          }
        };
      } catch (error) {
        console.error("Failed to open SSE notification stream", error);
      }
    };

    openStream();

    return () => {
      cancelled = true;
      if (source) {
        source.close();
      }
    };
  }, [accessToken, refetchNotifications, refetchUnreadCount]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Fetch initial notifications when popover opens
    refetchNotifications();
    refetchUnreadCount();

    // If there are unread notifications, mark them as read
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, [open, unreadCount, markAllAsRead, refetchNotifications, refetchUnreadCount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />

          {unreadCount > 0 ? (
            <Badge
              className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-1 text-[10px] font-semibold leading-none flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount >= 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 max-h-[440px] overflow-hidden">
<div className="flex flex-col gap-1 pb-3 border-b border-border/70 mb-3">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
            </p>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[360px]">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-background p-4 text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl border border-border/70 bg-background p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        notification.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-destructive-600"
                      }`}
                    >
                      {formatCurrency(notification.amount, {
                        showSign: true,
                        isExpense: notification.type === "EXPENSE",
                      })}
                    </p>
                    {!notification.isRead ? (
                      <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        New
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
