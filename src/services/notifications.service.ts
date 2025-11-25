import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  NotificationItem,
  NotificationsPagination,
  NotificationsQuery,
  NotificationsResponse,
} from "@/types";

type NotificationRaw = Record<string, unknown>;

const DEFAULT_QUERY: Required<NotificationsQuery> = {
  page: 1,
  perPage: 10,
};

const FALLBACK_ID_PREFIX = "notification";

const coerceString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
};

const parseDate = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value > 1e12 ? value : value * 1000;
    return new Date(normalized).toISOString();
  }

  return null;
};

const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "read", "yes", "completed"].includes(normalized)) return true;
    if (["0", "false", "unread", "no", "pending"].includes(normalized)) return false;
  }
  return fallback;
};

const buildQueryString = (query: NotificationsQuery): string => {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("perPage", String(query.perPage));
  return params.toString();
};

const extractArrayFromUnknown = (input: unknown): NotificationRaw[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input as NotificationRaw[];

  if (typeof input === "object") {
    const container = input as Record<string, unknown>;
    const candidateKeys = ["notifications", "data", "items", "results", "records", "rows"];

    for (const key of candidateKeys) {
      const value = container[key];
      if (Array.isArray(value)) {
        return value as NotificationRaw[];
      }
    }

    for (const key of candidateKeys) {
      const nested = container[key];
      if (nested && typeof nested === "object") {
        const nestedArray = extractArrayFromUnknown(nested);
        if (nestedArray.length) {
          return nestedArray;
        }
      }
    }
  }

  return [];
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
};

const extractPagination = (
  input: unknown
): Partial<NotificationsPagination> | null => {
  if (!input || typeof input !== "object") return null;
  const container = input as Record<string, unknown>;

  const currentPage =
    toNumber(container.currentPage) ??
    toNumber(container.current_page) ??
    toNumber(container.page);

  const perPage =
    toNumber(container.perPage) ??
    toNumber(container.per_page) ??
    toNumber(container.limit);

  const totalPages =
    toNumber(container.totalPages) ??
    toNumber(container.total_pages) ??
    toNumber(container.pages);

  const totalItems =
    toNumber(container.totalItems) ??
    toNumber(container.total_items) ??
    toNumber(container.total);

  const hasAnyValue =
    currentPage !== null ||
    perPage !== null ||
    totalPages !== null ||
    totalItems !== null;

  if (!hasAnyValue) {
    return null;
  }

  return {
    currentPage: currentPage ?? undefined,
    perPage: perPage ?? undefined,
    totalPages: totalPages ?? undefined,
    totalItems: totalItems ?? undefined,
  };
};

const createFallbackPagination = (
  query: Required<NotificationsQuery>,
  totalItems: number
): NotificationsPagination => {
  const perPage = query.perPage || totalItems || DEFAULT_QUERY.perPage;
  return {
    currentPage: query.page || DEFAULT_QUERY.page,
    perPage,
    totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
    totalItems,
  };
};

const normalizeNotification = (raw: NotificationRaw): NotificationItem => {
  const idSource =
    raw.notificationId ??
    raw.notification_id ??
    raw.id ??
    raw.uuid ??
    raw.reference ??
    raw.slug;
  const id =
    coerceString(idSource) ||
    `${FALLBACK_ID_PREFIX}-${Math.random().toString(36).slice(2, 10)}`;

  const title =
    coerceString(
      raw.title ??
        raw.subject ??
        raw.notificationTitle ??
        raw.heading ??
        raw.type,
      "Notification"
    ) || "Notification";

  const message =
    coerceString(
      raw.message ??
        raw.body ??
        raw.description ??
        raw.notificationMessage ??
        raw.notification ??
        raw.details,
      "No additional details provided."
    ) || "No additional details provided.";

  const createdAt =
    parseDate(
      raw.createdAt ??
        raw.created_at ??
        raw.timestamp ??
        raw.createdOn ??
        raw.created_on ??
        raw.date
    ) ?? new Date().toISOString();

  const readAt =
    parseDate(
      raw.readAt ??
        raw.read_at ??
        raw.readTimestamp ??
        raw.readOn ??
        raw.read_on
    ) ?? null;

  const isRead =
    readAt !== null
      ? true
      : parseBoolean(raw.isRead ?? raw.read ?? raw.status, false);

  const type = coerceString(
    raw.type ?? raw.category ?? raw.eventType ?? raw.notificationType
  );

  return {
    id,
    title,
    message,
    createdAt,
    readAt,
    isRead,
    type: type || undefined,
    metadata: { ...raw },
  };
};

class NotificationsService {
  async getNotifications(
    query: NotificationsQuery = DEFAULT_QUERY
  ): Promise<NotificationsResponse> {
    const mergedQuery: Required<NotificationsQuery> = {
      page: query.page ?? DEFAULT_QUERY.page,
      perPage: query.perPage ?? DEFAULT_QUERY.perPage,
    };

    const queryString = buildQueryString(mergedQuery);
    const url = queryString
      ? `${API_ENDPOINTS.NOTIFICATIONS.LIST}?${queryString}`
      : API_ENDPOINTS.NOTIFICATIONS.LIST;

    const response = await apiClient.get(url, { requiresAuth: true });

    if (response.error) {
      throw new Error(response.message || "Failed to fetch notifications");
    }

    const payload = response as Record<string, unknown>;
    let notificationsRaw = extractArrayFromUnknown(payload);
    if (!notificationsRaw.length) {
      notificationsRaw = extractArrayFromUnknown(payload.data);
    }

    const notifications = notificationsRaw.map(normalizeNotification);

    const paginationSource =
      payload.pagination ||
      (payload.data as Record<string, unknown>)?.pagination ||
      (payload.meta as Record<string, unknown>);

    const pagination =
      extractPagination(paginationSource) ||
      createFallbackPagination(mergedQuery, notifications.length);

    return {
      notifications,
      pagination: {
        currentPage: pagination.currentPage ?? mergedQuery.page,
        perPage: pagination.perPage ?? mergedQuery.perPage,
        totalPages: pagination.totalPages ?? 1,
        totalItems: pagination.totalItems ?? notifications.length,
      },
    };
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<NotificationItem | null> {
    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    const endpoint = API_ENDPOINTS.NOTIFICATIONS.MARK_READ.replace(
      ":id",
      encodeURIComponent(notificationId)
    );

    const response = await apiClient.put(endpoint, undefined, {
      requiresAuth: true,
    });

    if (response.error) {
      throw new Error(response.message || "Failed to mark notification as read");
    }

    if (response.data && typeof response.data === "object") {
      return normalizeNotification(response.data as NotificationRaw);
    }

    return null;
  }
}

export const notificationsService = new NotificationsService();

