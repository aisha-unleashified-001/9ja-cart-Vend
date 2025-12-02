export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationsPagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export interface NotificationsQuery {
  page?: number;
  perPage?: number;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  pagination: NotificationsPagination;
}




