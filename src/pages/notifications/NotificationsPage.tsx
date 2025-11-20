import { useMemo } from 'react';

export default function NotificationsPage() {
  const notifications = useMemo(
    () => [
      {
        id: 'suspension',
        title: 'Account Suspended',
        description:
          'Your vendor account is currently suspended. Please review the suspension notice and follow the outlined steps to resolve the issue.',
        date: 'Today',
        status: 'unread',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          Stay up to date with important updates about your account and store activity.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-border last:border-b-0 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{notification.title}</h2>
              <span className="text-xs text-muted-foreground">{notification.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{notification.description}</p>
            {notification.id === 'suspension' && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                Contact support to appeal the suspension or submit any required documentation.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



