import type { NotificationItem } from '@/types';

const SUSPENSION_KEYWORDS = [
  'suspend',
  'suspension',
  'unsuspend',
  'deactivate',
  'reactivate',
  'reinstate',
];

const ACCOUNT_SUSPENDED_KEYWORDS = ['suspend', 'suspension', 'deactivate'];
const ACCOUNT_REINSTATED_KEYWORDS = ['reinstate', 'reactivate', 'unsuspend'];

type MaybeNotification =
  | Pick<NotificationItem, 'id' | 'title' | 'message' | 'type' | 'createdAt'>
  | null
  | undefined;

const toLower = (value?: string | null): string => value?.toLowerCase() ?? '';

const matchesKeyword = (haystacks: string[], keywords: string[]): boolean =>
  haystacks.some((value) => keywords.some((keyword) => value.includes(keyword)));

const getNotificationStatus = (
  notification: MaybeNotification
): 'suspended' | 'reinstated' | null => {
  if (!notification) return null;

  const haystacks = [notification.title, notification.type, notification.message]
    .filter(Boolean)
    .map((value) => toLower(value as string));

  if (haystacks.length === 0) return null;

  if (matchesKeyword(haystacks, ACCOUNT_SUSPENDED_KEYWORDS)) {
    return 'suspended';
  }

  if (matchesKeyword(haystacks, ACCOUNT_REINSTATED_KEYWORDS)) {
    return 'reinstated';
  }

  return null;
};

const parseTimestamp = (value?: string | null): number => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const isSuspensionNotification = (
  notification: MaybeNotification
): boolean => {
  if (!notification) return false;

  const haystacks = [notification.title, notification.type, notification.message]
    .filter(Boolean)
    .map((value) => toLower(value as string));

  return matchesKeyword(haystacks, SUSPENSION_KEYWORDS);
};

export const hasSuspensionNotification = (
  notifications: MaybeNotification[]
): boolean => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return false;
  }

  return notifications.some(isSuspensionNotification);
};

interface DerivedSuspensionStatus {
  notification: NotificationItem;
  isSuspended: boolean;
}

export const deriveSuspensionStatusFromNotifications = (
  notifications: MaybeNotification[]
): DerivedSuspensionStatus | null => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }

  let latest: (DerivedSuspensionStatus & { timestamp: number }) | null = null;

  for (const candidate of notifications) {
    const status = getNotificationStatus(candidate);
    if (!status || !candidate) {
      continue;
    }

    const timestamp = parseTimestamp(candidate.createdAt);
    if (!latest || timestamp > latest.timestamp) {
      latest = {
        notification: candidate as NotificationItem,
        isSuspended: status === 'suspended',
        timestamp,
      };
    }
  }

  return latest ? { notification: latest.notification, isSuspended: latest.isSuspended } : null;
};

