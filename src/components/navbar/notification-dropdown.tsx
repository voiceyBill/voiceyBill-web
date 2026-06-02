import { useState, useRef, useEffect } from "react";
import { Bell, X, Trash2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useTypedSelector, useAppDispatch } from "@/app/hook";
import { Button } from "../ui/button";
import {
  markAsRead,
  removeNotification,
  markAllAsRead,
  clearNotifications,
} from "@/features/notification/notificationSlice";
import { cn } from "@/lib/utils";

export const NotificationDropdown = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useTypedSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleRemoveNotification = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "budget_alert":
        return AlertTriangle;
      case "error":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50 dark:bg-zinc-900";
    switch (type) {
      case "budget_alert":
        return "bg-amber-50 dark:bg-amber-950/20";
      case "error":
        return "bg-red-50 dark:bg-red-950/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/20";
      default:
        return "bg-blue-50 dark:bg-blue-950/20";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
      </Button>

      {/* Notification badge */}
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green dark:bg-brand-green-light opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-green dark:bg-brand-green-light"></span>
        </span>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-zinc-950 border border-border rounded-lg shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => dispatch(markAllAsRead())}
                >
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => dispatch(clearNotifications())}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    "border-b border-border/50 p-3 cursor-pointer transition-colors hover:bg-muted/50",
                    getBgColor(notification.type, notification.read)
                  )}
                >
                  <div className="flex items-start gap-2">
                    {(() => {
                      const Icon = getNotificationIcon(notification.type);
                      return <Icon className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />;
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-foreground truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onClick={(e) =>
                        handleRemoveNotification(e, notification.id)
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
