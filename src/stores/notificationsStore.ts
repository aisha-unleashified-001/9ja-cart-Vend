import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { notificationsService } from "@/services/notifications.service";
import type {
  NotificationItem,
  NotificationsPagination,
  NotificationsQuery,
} from "@/types";

interface NotificationsStore {
  notifications: NotificationItem[];
  pagination: NotificationsPagination | null;
  query: Required<NotificationsQuery>;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  updatingIds: Record<string, boolean>;
  fetchNotifications: (query?: NotificationsQuery) => Promise<void>;
  refresh: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  setQuery: (query: NotificationsQuery) => void;
  reset: () => void;
}

const INITIAL_QUERY: Required<NotificationsQuery> = {
  page: 1,
  perPage: 10,
};

export const useNotificationsStore = create<NotificationsStore>()(
  devtools((set, get) => ({
    notifications: [],
    pagination: null,
    query: INITIAL_QUERY,
    unreadCount: 0,
    isLoading: false,
    error: null,
    hasFetched: false,
    updatingIds: {},

    fetchNotifications: async (overrideQuery) => {
      const currentQuery = {
        ...get().query,
        ...overrideQuery,
      };

      set({ isLoading: true, error: null, query: currentQuery });

      try {
        const response = await notificationsService.getNotifications(currentQuery);
        const unreadCount = response.notifications.filter(
          (notification) => !notification.isRead
        ).length;

        set({
          notifications: response.notifications,
          pagination: response.pagination,
          unreadCount,
          isLoading: false,
          error: null,
          hasFetched: true,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load notifications";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    refresh: async () => {
      await get().fetchNotifications();
    },

    markAsRead: async (notificationId: string) => {
      if (!notificationId) return;
      const { notifications, updatingIds } = get();
      const target = notifications.find((n) => n.id === notificationId);
      if (!target || target.isRead || updatingIds[notificationId]) {
        return;
      }

      set((state) => ({
        updatingIds: { ...state.updatingIds, [notificationId]: true },
        error: null,
      }));

      try {
        const updated = await notificationsService.markNotificationAsRead(
          notificationId
        );

        set((state) => {
          const nextNotifications = state.notifications.map((notification) => {
            if (notification.id !== notificationId) {
              return notification;
            }

            // Preserve original notification data, only update read status
            return {
              ...notification,
              isRead: true,
              readAt:
                updated?.readAt ??
                notification.readAt ??
                new Date().toISOString(),
              // Only update title/message if the API returned valid data (not fallback values)
              ...(updated?.title &&
              updated.title !== "Notification" &&
              updated.title !== notification.title
                ? { title: updated.title }
                : {}),
              ...(updated?.message &&
              updated.message !== "No additional details provided." &&
              updated.message !== notification.message
                ? { message: updated.message }
                : {}),
            };
          });

          const unreadCount = nextNotifications.filter(
            (notification) => !notification.isRead
          ).length;

          const nextIds = { ...state.updatingIds };
          delete nextIds[notificationId];

          return {
            notifications: nextNotifications,
            unreadCount,
            updatingIds: nextIds,
          };
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read";
        set((state) => {
          const nextIds = { ...state.updatingIds };
          delete nextIds[notificationId];
          return {
            error: errorMessage,
            updatingIds: nextIds,
          };
        });
        throw error;
      }
    },

    setQuery: (query) => {
      set((state) => ({
        query: {
          ...state.query,
          ...query,
        },
      }));
    },

    reset: () =>
      set({
        notifications: [],
        pagination: null,
        query: INITIAL_QUERY,
        unreadCount: 0,
        isLoading: false,
        error: null,
        hasFetched: false,
        updatingIds: {},
      }),
  }))
);

