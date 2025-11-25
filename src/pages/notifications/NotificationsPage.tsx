import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Pagination } from "@/components/ui/Pagination";
import { ChevronRight } from "lucide-react";

const formatDateTime = (value?: string | null): string => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export default function NotificationsPage() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const pagination = useNotificationsStore((state) => state.pagination);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const error = useNotificationsStore((state) => state.error);
  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications
  );
  const hasFetched = useNotificationsStore((state) => state.hasFetched);

  useEffect(() => {
    if (!hasFetched) {
      fetchNotifications().catch((err) =>
        console.error("Failed to load notifications", err)
      );
    }
  }, [fetchNotifications, hasFetched]);

  const handlePageChange = (page: number) => {
    fetchNotifications({ page }).catch((err) =>
      console.error("Failed to change page", err)
    );
  };

  const handlePerPageChange = (perPage: number) => {
    fetchNotifications({ perPage, page: 1 }).catch((err) =>
      console.error("Failed to update per page", err)
    );
  };

  const handleRefresh = () => {
    fetchNotifications().catch((err) =>
      console.error("Failed to refresh notifications", err)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Stay up to date with important updates about your account and store
            activity.
          </p>
          {unreadCount > 0 && (
            <p className="text-sm text-primary mt-1">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {isLoading && notifications.length === 0 && (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && notifications.length === 0 && !error && (
        <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p className="font-medium text-foreground">No notifications yet</p>
          <p className="text-sm mt-1">
            System alerts, suspension notices, and other updates will appear
            here as they arrive.
          </p>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              to={`/notifications/${notification.id}`}
              className={`block p-4 sm:p-5 hover:bg-secondary/50 transition-colors ${
                notification.isRead ? "" : "bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-foreground">
                        {notification.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          notification.isRead
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
                    <span>{formatDateTime(notification.createdAt)}</span>
                    {notification.readAt && (
                      <span>Read {formatDateTime(notification.readAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination && notifications.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          perPage={pagination.perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}