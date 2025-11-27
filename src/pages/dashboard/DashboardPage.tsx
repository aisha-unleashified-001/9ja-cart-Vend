import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useDashboard } from '@/hooks/useDashboard';
import { useSuspensionCheck } from '@/hooks/useSuspensionCheck';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import type { AccountStatus } from '@/types';

const SUSPENSION_KEYWORDS = ["suspend"];

const isSuspensionNotification = (notification: { title?: string; type?: string; message?: string }) => {
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

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { dashboardData, isLoading, error, fetchDashboardSummary } = useDashboard();
  const { isSuspended } = useSuspensionCheck();
  const notifications = useNotificationsStore((state) => state.notifications);
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const hasFetched = useNotificationsStore((state) => state.hasFetched);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  // Fetch notifications if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      fetchNotifications().catch((err) =>
        console.error("Failed to load notifications", err)
      );
    }
  }, [hasFetched, fetchNotifications]);

  // Find the latest suspension notification
  const latestSuspensionNotification = useMemo(() => {
    const suspensionNotifications = notifications.filter(isSuspensionNotification);
    if (suspensionNotifications.length === 0) return null;
    
    // Sort by createdAt descending to get the latest
    return suspensionNotifications.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })[0];
  }, [notifications]);

  const accountStatus = dashboardData?.accountStatus as AccountStatus | undefined;
  const isAccountSuspended =
    accountStatus && ['suspended', 'deactivated'].includes(accountStatus.toLowerCase());

  const dashboardSuspension =
    typeof dashboardData?.isSuspended === 'boolean' ? dashboardData.isSuspended : undefined;
  
  // Prefer dashboard suspension status when it's present, otherwise fall back to user/auth data
  const isSuspendedAccount = typeof dashboardSuspension === 'boolean'
    ? dashboardSuspension
    : Boolean(isSuspended || isAccountSuspended);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <button
          onClick={fetchDashboardSummary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Seller'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's what's happening with {user?.storeName || user?.businessName || 'your store'}.
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={fetchDashboardSummary}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50 text-sm"
          >
            {isLoading ? '🔄' : '↻'} <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to={isSuspendedAccount ? "#" : "/products/new"}
            onClick={(e) => {
              if (isSuspendedAccount) {
                e.preventDefault();
              }
            }}
            className={`px-3 sm:px-4 py-2 rounded-md transition-colors text-sm ${
              isSuspendedAccount
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            title={isSuspendedAccount ? "Account suspended - Cannot add products" : "Add Product"}
          >
            <span className="sm:hidden">+ Product</span>
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Suspension Banner */}
      {isSuspendedAccount && (
        <div className="text-base sm:text-lg text-red-600 bg-red-50 border-2 border-red-300 rounded-lg px-6 py-4 sm:px-8 sm:py-6 relative">
          <p>
            Your account has been suspended, to get more information{' '}
            {latestSuspensionNotification ? (
              <Link
                to={`/notifications/${latestSuspensionNotification.id}`}
                className="underline font-semibold hover:text-red-700 transition-colors"
              >
                click here
              </Link>
            ) : (
              <span className="underline font-semibold">click here</span>
            )}
            .
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{dashboardData?.totalProducts || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{dashboardData?.totalOrders || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {formatCurrency(dashboardData?.totalRevenue || 0)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{dashboardData?.pendingOrders || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-lg sm:text-xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <Link to="/orders" className="text-primary hover:text-primary/80 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
              dashboardData.recentOrders.slice(0, 3).map((order) => (
                <div key={order.orderNo} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium text-foreground">{order.orderNo}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.products.length} item{order.products.length > 1 ? 's' : ''} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatCurrency(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent orders</p>
                <p className="text-sm">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Top Products</h2>
            <Link to="/products" className="text-primary hover:text-primary/80 text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
              dashboardData.topProducts.slice(0, 3).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.totalSold} sold • {product.totalOrders} order{product.totalOrders > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-foreground">{formatCurrency(product.totalRevenue)}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No top products yet</p>
                <p className="text-sm">Your best-selling products will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}