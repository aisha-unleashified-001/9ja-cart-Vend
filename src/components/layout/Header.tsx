import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationsStore } from "@/stores/notificationsStore";

const RELATIVE_TIME_DIVISIONS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const formatRelativeTime = (dateValue?: string | null): string => {
  if (!dateValue) return "";
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  let durationInSeconds = (parsedDate.getTime() - Date.now()) / 1000;

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(durationInSeconds) < division.amount) {
      return relativeTimeFormatter.format(
        Math.round(durationInSeconds),
        division.unit
      );
    }
    durationInSeconds /= division.amount;
  }

  return "";
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Refs for click outside detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Get user data from auth store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const notificationsLoading = useNotificationsStore((state) => state.isLoading);
  const notificationsError = useNotificationsStore((state) => state.error);
  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications
  );
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const hasFetched = useNotificationsStore((state) => state.hasFetched);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchNotifications().catch((error) =>
        console.error("Failed to load notifications", error)
      );
    }
  }, [fetchNotifications, hasFetched]);

  const handleNotificationInteraction = (notificationId: string, isRead: boolean) => {
    if (isRead) return;
    markAsRead(notificationId).catch((error) =>
      console.error("Failed to update notification", error)
    );
  };

  const handleRefreshNotifications = () => {
    fetchNotifications().catch((error) =>
      console.error("Failed to refresh notifications", error)
    );
  };

  const visibleNotifications = notifications.slice(0, 5);

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-xl">☰</span>
        </button>
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">
          Seller Dashboard
        </h1>
        <h1 className="text-base font-semibold text-foreground sm:hidden">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search */}
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 xl:w-64 px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-card border border-border rounded-md shadow-lg z-50">
              <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You're all caught up"}
                  </p>
                </div>
                <button
                  onClick={handleRefreshNotifications}
                  disabled={notificationsLoading}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {notificationsLoading ? "..." : "Refresh"}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notificationsLoading && !visibleNotifications.length && (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading notifications...
                  </div>
                )}

                {notificationsError && !visibleNotifications.length && !notificationsLoading && (
                  <div className="p-4 text-sm text-red-500 space-y-2">
                    <p>Unable to load notifications.</p>
                    <button
                      onClick={handleRefreshNotifications}
                      className="text-primary underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!notificationsLoading &&
                  !notificationsError &&
                  visibleNotifications.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">
                      No notifications yet.
                    </div>
                  )}

                {visibleNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() =>
                      handleNotificationInteraction(
                        notification.id,
                        notification.isRead
                      )
                    }
                    className={`w-full text-left p-4 border-b border-border last:border-b-0 transition-colors ${
                      notification.isRead ? "bg-card" : "bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 mt-1 rounded-full bg-primary flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <Link
                  to="/notifications"
                  className="block w-full text-center py-2 text-sm text-primary hover:text-primary/80"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user ? getInitials(user.fullName) : "U"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.storeName || user?.businessName || "Store"}
              </p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-card border border-border rounded-md shadow-lg z-50">
              {/* User Info Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user ? getInitials(user.fullName) : "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.emailAddress || "user@example.com"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.storeName || user?.businessName || "Store"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md"
                  onClick={() => setShowProfile(false)}
                >
                  <span className="mr-3">👤</span>
                  <span className="truncate">Profile Settings</span>
                </Link>
                <Link
                  to="/storefront"
                  className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md"
                  onClick={() => setShowProfile(false)}
                >
                  <span className="mr-3">🏪</span>
                  <span className="truncate">My Storefront</span>
                </Link>
                <hr className="my-2 border-border" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md"
                >
                  <span className="mr-3">🚪</span>
                  <span className="truncate">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
