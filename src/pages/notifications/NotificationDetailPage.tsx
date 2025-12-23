import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ArrowLeft, AlertTriangle, CheckCircle2, Info, Bell, Clock, Check } from "lucide-react";
import type { NotificationItem } from "@/types";

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

const SUSPENSION_KEYWORDS = ["suspend"];
const REINSTATE_KEYWORDS = ["reinstat", "re instat", "reinstate"];
const LOW_STOCK_KEYWORDS = ["low stock", "inventory alert", "stock alert"];
const NEW_ORDER_KEYWORDS = ["new order", "order placed", "order alert"];
const REASON_KEYS = [
  "reason",
  "suspensionReason",
  "suspension_reason",
  "suspendReason",
];
const ACTION_KEYS = [
  "requiredAction",
  "requiredActions",
  "actionRequired",
  "nextSteps",
  "resolutionSteps",
  "actions",
];
const PRODUCT_ID_KEYS = [
  "productId",
  "product_id",
  "productID",
  "productUuid",
  "productUUID",
  "sku",
];
const PRODUCT_NAME_KEYS = [
  "productName",
  "product_name",
  "productTitle",
  "product_title",
];
const STOCK_KEYS = [
  "currentStock",
  "current_stock",
  "stock",
  "quantity",
  "available",
];
const ORDER_SUMMARY_KEYS = [
  "orderSummary",
  "orderMessage",
  "orderDetails",
  "order_info",
  "orderInfo",
];

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const toText = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
};

const extractFromMetadata = (
  notification: NotificationItem,
  keys: string[]
): string | undefined => {
  if (!notification.metadata) return undefined;
  const normalizedEntries = Object.entries(notification.metadata).reduce<
    Record<string, string | undefined>
  >((acc, [entryKey, entryValue]) => {
    acc[normalizeKey(entryKey)] = toText(entryValue);
    return acc;
  }, {});

  for (const key of keys) {
    const normalizedKey = normalizeKey(key);
    if (normalizedEntries[normalizedKey]) {
      return normalizedEntries[normalizedKey];
    }
  }

  return undefined;
};

const extractFromMessage = (
  message: string,
  labels: string[]
): string | undefined => {
  if (!message) return undefined;

  const labelRegex = new RegExp(
    `(?:^|\\n|\\.|-)\\s*(?:${labels
      .map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, ""))
      .join("|")})s?\\s*:\\s*([^\\n]+)`,
    "i"
  );

  const match = message.match(labelRegex);
  if (match && match[1]) {
    return match[1].trim();
  }

  const lines = message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    for (const label of labels) {
      const normalizedLabel = label.toLowerCase();
      if (line.toLowerCase().startsWith(`${normalizedLabel}:`)) {
        return line.split(":").slice(1).join(":").trim();
      }
    }
  }

  return undefined;
};

const getSuspensionDetails = (notification: NotificationItem) => {
  const message = notification.message || "";
  const reason =
    extractFromMetadata(notification, REASON_KEYS) ||
    extractFromMessage(message, ["Reason", "Suspension Reason"]);
  const requiredActions =
    extractFromMetadata(notification, ACTION_KEYS) ||
    extractFromMessage(message, [
      "Required Action",
      "Required Actions",
      "Next Steps",
    ]);

  return { reason, requiredActions };
};

const sanitizeReasonText = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  let clean = value.replace(/Required actions?:[\s\S]+$/i, " ");
  clean = clean.replace(/Please contact support for more information\.?/gi, " ");
  clean = clean.replace(/\s{2,}/g, " ").trim();
  return clean || undefined;
};

const isSuspensionNotification = (notification: NotificationItem | undefined) => {
  if (!notification) return false;
  const haystacks = [
    notification.title,
    notification.type,
    notification.message,
  ]
    .filter(Boolean)
    .map((value) => value?.toLowerCase() ?? "");

  return haystacks.some((value) =>
    SUSPENSION_KEYWORDS.some((keyword) => value.includes(keyword))
  );
};

const containsKeyword = (
  notification: NotificationItem | undefined,
  keywords: string[]
) => {
  if (!notification) return false;
  const haystacks = [
    notification.title,
    notification.type,
    notification.message,
  ]
    .filter(Boolean)
    .map((value) => value?.toLowerCase() ?? "");

  return haystacks.some((value) =>
    keywords.some((keyword) => value.includes(keyword))
  );
};

const extractByRegex = (message: string, regex: RegExp): string | undefined => {
  if (!message) return undefined;
  const match = message.match(regex);
  return match?.[1]?.trim();
};

const splitSentences = (text: string): string[] => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

type HighlightTone = "danger" | "success";
type HighlightBlock = {
  id: string;
  title: string;
  body: string;
  tone: HighlightTone;
};

const HIGHLIGHT_TONE_STYLES: Record<
  HighlightTone,
  {
    container: string;
    title: string;
  }
> = {
  danger: {
    container: "border-red-200 bg-red-50 text-red-700",
    title: "text-red-800",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-700",
    title: "text-emerald-800",
  },
};

const buildLowStockHighlight = (
  notification: NotificationItem
): HighlightBlock | null => {
  const message = notification.message || "";
  const productId =
    extractFromMetadata(notification, PRODUCT_ID_KEYS) ||
    extractByRegex(message, /Product ID:\s*([A-Za-z0-9-]+)/i);
  const currentStock =
    extractFromMetadata(notification, STOCK_KEYS) ||
    extractByRegex(message, /Current stock:\s*([A-Za-z0-9]+)/i);

  const lines = [
    productId ? `Product ID: ${productId}` : undefined,
    currentStock ? `Current stock: ${currentStock}` : undefined,
  ].filter(Boolean);

  if (!lines.length) return null;

  return {
    id: "low-stock",
    title: "Low stock alert",
    body: lines.join("\n"),
    tone: "danger",
  };
};

const buildOrderHighlight = (
  notification: NotificationItem
): HighlightBlock | null => {
  const message =
    extractFromMetadata(notification, ORDER_SUMMARY_KEYS) ||
    notification.message ||
    "";

  const summary =
    splitSentences(message).find((sentence) => /order/i.test(sentence)) ||
    message.trim();

  if (!summary) {
    return null;
  }

  return {
    id: "new-order",
    title: "New order placed",
    body: summary,
    tone: "success",
  };
};

const buildReinstatedHighlight = (
  notification: NotificationItem
): HighlightBlock | null => {
  const message = notification.message || "";
  const summary =
    splitSentences(message).find((sentence) =>
      /reinstated|re instated/i.test(sentence)
    ) ||
    "Your vendor account has been reinstated. You can now access your dashboard.";

  return {
    id: "reinstated",
    title: "Account reinstated",
    body: summary,
    tone: "success",
  };
};

const buildSuspensionHighlights = (
  notification: NotificationItem
): HighlightBlock[] => {
  const highlights: HighlightBlock[] = [];
  const { reason, requiredActions } = getSuspensionDetails(notification);
  const cleanReason = sanitizeReasonText(reason);
  if (cleanReason) {
    highlights.push({
      id: "suspension-reason",
      title: "Reason",
      body: cleanReason,
      tone: "danger",
    });
  }
  if (requiredActions) {
    highlights.push({
      id: "suspension-actions",
      title: "Required action",
      body: requiredActions,
      tone: "success",
    });
  }
  return highlights;
};

const buildHighlights = (
  notification: NotificationItem | undefined
): HighlightBlock[] => {
  if (!notification) return [];
  const highlights: HighlightBlock[] = [];

  if (containsKeyword(notification, REINSTATE_KEYWORDS)) {
    const reinstatedHighlight = buildReinstatedHighlight(notification);
    if (reinstatedHighlight) {
      highlights.push(reinstatedHighlight);
    }
    return highlights;
  }

  if (isSuspensionNotification(notification)) {
    highlights.push(...buildSuspensionHighlights(notification));
  }

  if (containsKeyword(notification, LOW_STOCK_KEYWORDS)) {
    const lowStockHighlight = buildLowStockHighlight(notification);
    if (lowStockHighlight) {
      highlights.push(lowStockHighlight);
    }
  }

  if (containsKeyword(notification, NEW_ORDER_KEYWORDS)) {
    const orderHighlight = buildOrderHighlight(notification);
    if (orderHighlight) {
      highlights.push(orderHighlight);
    }
  }

  return highlights;
};

const sanitizeNotificationMessage = (
  notification: NotificationItem | undefined
): string | null => {
  const original = notification?.message;
  if (!notification || !original) {
    return null;
  }

  let message = original;

  const removePattern = (pattern: RegExp) => {
    message = message.replace(pattern, " ").trim();
  };

  if (containsKeyword(notification, REINSTATE_KEYWORDS)) {
    removePattern(
      /Your vendor account has been reinstated\.?\s*You can now access your dashboard\.?/gi
    );
  }

  if (isSuspensionNotification(notification)) {
    removePattern(/Your vendor account has been suspended\.?/gi);
    removePattern(/Reason:\s*[^\n.]+[.\n]?/gi);
    removePattern(/Required actions?:\s*[^\n.]+[.\n]?/gi);
    removePattern(/Please contact support for more information\.?/gi);
  }

  if (containsKeyword(notification, LOW_STOCK_KEYWORDS)) {
    const productName =
      extractFromMetadata(notification, PRODUCT_NAME_KEYS) ||
      extractByRegex(original, /product ['"]([^'"]+)['"]/i);
    const label = productName
      ? `Stock for product '${productName}' is low. Please restock soon.`
      : "Stock for this product is low. Please restock soon.";
    message = label;
  }

  if (containsKeyword(notification, NEW_ORDER_KEYWORDS)) {
    removePattern(/A new order[^.!\n]*[.!]?/gi);
  }

  const normalized = message.replace(/\s{2,}/g, " ").trim();
  return normalized.length ? normalized : null;
};

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const notifications = useNotificationsStore((state) => state.notifications);
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications
  );
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const updatingIds = useNotificationsStore((state) => state.updatingIds);
  const hasFetched = useNotificationsStore((state) => state.hasFetched);

  // Fetch notifications if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      fetchNotifications().catch((err) =>
        console.error("Failed to load notifications", err)
      );
    }
  }, [fetchNotifications, hasFetched]);

  // Find the notification
  const notification = id
    ? notifications.find((n) => n.id === id)
    : undefined;

  // Mark as read when viewing
  useEffect(() => {
    if (notification && !notification.isRead && id) {
      markAsRead(id).catch((err) =>
        console.error("Failed to mark notification as read", err)
      );
    }
  }, [notification, id, markAsRead]);

  const handleMarkAsRead = () => {
    if (notification && !notification.isRead && id) {
      markAsRead(id).catch((err) =>
        console.error("Failed to mark notification as read", err)
      );
    }
  };

  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="space-y-6">
        <Link
          to="/notifications"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notifications
        </Link>
        <ErrorMessage message="Notification not found" />
      </div>
    );
  }

  const highlights = useMemo(() => buildHighlights(notification), [notification]);
  const messageToDisplay = useMemo(
    () => sanitizeNotificationMessage(notification),
    [notification]
  );

  const isSuspended = isSuspensionNotification(notification);
  const isReinstated = containsKeyword(notification, REINSTATE_KEYWORDS);

  // Determine notification icon and styling
  const getNotificationIcon = () => {
    if (isSuspended) {
      return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
    if (isReinstated) {
      return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    }
    return <Bell className="w-6 h-6 text-primary" />;
  };

  const getNotificationHeaderStyle = () => {
    if (isSuspended) {
      return "bg-gradient-to-r from-red-50 to-red-100/50 border-red-200";
    }
    if (isReinstated) {
      return "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200";
    }
    return "bg-gradient-to-r from-primary/5 to-primary/10 border-border";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        to="/notifications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Notifications
      </Link>

      {/* Notification Card with Message-like Design */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className={`${getNotificationHeaderStyle()} border-b px-6 py-5`}>
          <div className="flex items-start gap-4">
            {/* Icon Avatar */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isSuspended 
                ? "bg-red-100" 
                : isReinstated 
                ? "bg-emerald-100" 
                : "bg-primary/10"
            }`}>
              {getNotificationIcon()}
            </div>
            
            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-tight">
                  {notification.title}
                </h1>
                {!notification.isRead && (
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDateTime(notification.createdAt)}</span>
                </div>
                {notification.readAt && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Read {formatDateTime(notification.readAt)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Message Content Section */}
        <div className="px-6 py-6 space-y-5">
          {/* Main Message */}
          {messageToDisplay && (
            <div className="prose prose-sm max-w-none">
              <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                {messageToDisplay}
              </p>
            </div>
          )}

          {/* Highlights/Details - Redesigned as Info Cards */}
          {highlights.length > 0 && (
            <div className="space-y-3">
              {highlights.map((highlight) => {
                const toneStyles = HIGHLIGHT_TONE_STYLES[highlight.tone];
                const Icon = highlight.tone === "danger" ? AlertTriangle : Info;
                return (
                  <div
                    key={highlight.id}
                    className={`rounded-lg border-2 px-5 py-4 ${toneStyles.container} transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        highlight.tone === "danger" 
                          ? "bg-red-100" 
                          : "bg-emerald-100"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          highlight.tone === "danger" 
                            ? "text-red-600" 
                            : "text-emerald-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm mb-1.5 ${toneStyles.title}`}>
                          {highlight.title}
                        </p>
                        <p className="text-sm whitespace-pre-line leading-relaxed">
                          {highlight.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Button */}
          {!notification.isRead && (
            <div className="pt-2">
              <button
                onClick={handleMarkAsRead}
                disabled={Boolean(updatingIds[notification.id])}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#8DEB6E] text-primary text-sm font-medium hover:bg-[#8DEB6E]/90 transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingIds[notification.id] ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Marking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Mark as read
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

