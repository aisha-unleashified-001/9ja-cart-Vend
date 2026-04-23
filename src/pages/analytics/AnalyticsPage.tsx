import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useVendorAnalytics } from "@/hooks/useVendorAnalytics";
import type { AnalyticsData, Timeframe } from "@/types";
import { Download } from "lucide-react";

const vendorAnalytics: AnalyticsData = {
  inventorySnapshot: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  },
  summaryCards: {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  },
  revenueSeries: {
    "7d": [],
    "30d": [],
  },
  salesByCategory: [],
  topSellingProducts: {
    "7d": [],
    "30d": [],
  },
  customerInsights: {
    "7d": {
      totalCustomers: 0,
      newCustomersLabel: "New This Week",
      newCustomers: 0,
      repeatBuyers: 0,
      locations: [],
    },
    "30d": {
      totalCustomers: 0,
      newCustomersLabel: "New This Month",
      newCustomers: 0,
      repeatBuyers: 0,
      locations: [],
    },
  },
};

const adminAnalytics: AnalyticsData = {
  inventorySnapshot: {
    totalProducts: 2482,
    totalOrders: 6421,
    totalRevenue: 92500000,
    pendingOrders: 312,
  },
  summaryCards: {
    totalRevenue: 92500000,
    totalOrders: 6421,
    avgOrderValue: 14406,
    conversionRate: 4.1,
  },
  revenueSeries: {
    "7d": [
      { label: "Mon", value: 8100000 },
      { label: "Tue", value: 9500000 },
      { label: "Wed", value: 8800000 },
      { label: "Thu", value: 10400000 },
      { label: "Fri", value: 11200000 },
      { label: "Sat", value: 12600000 },
      { label: "Sun", value: 9700000 },
    ],
    "30d": [
      { label: "Wk 1", value: 23800000 },
      { label: "Wk 2", value: 22400000 },
      { label: "Wk 3", value: 24700000 },
      { label: "Wk 4", value: 21600000 },
    ],
  },
  salesByCategory: [
    { category: "Electronics", percentage: 39 },
    { category: "Fashion", percentage: 28 },
    { category: "Home & Living", percentage: 16 },
    { category: "Beauty", percentage: 11 },
    { category: "Others", percentage: 6 },
  ],
  topSellingProducts: {
    "7d": [
      { product: "Bluetooth Speaker", sales: 1540, revenue: 23100000 },
      { product: "Men's Sneakers", sales: 1365, revenue: 20475000 },
      { product: "Air Fryer", sales: 1220, revenue: 18300000 },
      { product: "Face Serum Set", sales: 1085, revenue: 14647500 },
      { product: "Office Chair", sales: 925, revenue: 17575000 },
    ],
    "30d": [
      { product: "Men's Sneakers", sales: 5230, revenue: 78450000 },
      { product: "Bluetooth Speaker", sales: 4880, revenue: 73200000 },
      { product: "Air Fryer", sales: 4015, revenue: 60225000 },
      { product: "Office Chair", sales: 3552, revenue: 67488000 },
      { product: "Face Serum Set", sales: 3295, revenue: 44482500 },
    ],
  },
  customerInsights: {
    "7d": {
      totalCustomers: 14120,
      newCustomersLabel: "New This Week",
      newCustomers: 1160,
      repeatBuyers: 3820,
      locations: [
        { state: "Lagos", percentage: 34 },
        { state: "Abuja", percentage: 19 },
        { state: "Port Harcourt", percentage: 13 },
        { state: "Kano", percentage: 11 },
        { state: "Others", percentage: 23 },
      ],
    },
    "30d": {
      totalCustomers: 58400,
      newCustomersLabel: "New This Month",
      newCustomers: 6240,
      repeatBuyers: 16200,
      locations: [
        { state: "Lagos", percentage: 31 },
        { state: "Abuja", percentage: 21 },
        { state: "Port Harcourt", percentage: 14 },
        { state: "Kano", percentage: 10 },
        { state: "Others", percentage: 24 },
      ],
    },
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const getApprovedAccent = (index = 0) =>
  `rgba(141, 235, 110, ${Math.max(0.35, 1 - index * 0.12)})`;

const mergeAnalyticsData = (
  fallback: AnalyticsData,
  incoming?: Partial<AnalyticsData> | null
): AnalyticsData => ({
  inventorySnapshot: {
    totalProducts:
      incoming?.inventorySnapshot?.totalProducts ??
      fallback.inventorySnapshot.totalProducts,
    totalOrders:
      incoming?.inventorySnapshot?.totalOrders ??
      fallback.inventorySnapshot.totalOrders,
    totalRevenue:
      incoming?.inventorySnapshot?.totalRevenue ??
      fallback.inventorySnapshot.totalRevenue,
    pendingOrders:
      incoming?.inventorySnapshot?.pendingOrders ??
      fallback.inventorySnapshot.pendingOrders,
  },
  summaryCards: {
    totalRevenue:
      incoming?.summaryCards?.totalRevenue ?? fallback.summaryCards.totalRevenue,
    totalOrders:
      incoming?.summaryCards?.totalOrders ?? fallback.summaryCards.totalOrders,
    avgOrderValue:
      incoming?.summaryCards?.avgOrderValue ?? fallback.summaryCards.avgOrderValue,
    conversionRate:
      incoming?.summaryCards?.conversionRate ??
      fallback.summaryCards.conversionRate,
  },
  revenueSeries: {
    "7d":
      incoming?.revenueSeries?.["7d"] && incoming.revenueSeries["7d"].length > 0
        ? incoming.revenueSeries["7d"]
        : fallback.revenueSeries["7d"],
    "30d":
      incoming?.revenueSeries?.["30d"] && incoming.revenueSeries["30d"].length > 0
        ? incoming.revenueSeries["30d"]
        : fallback.revenueSeries["30d"],
  },
  salesByCategory:
    incoming?.salesByCategory && incoming.salesByCategory.length > 0
      ? incoming.salesByCategory
      : fallback.salesByCategory,
  topSellingProducts: {
    "7d":
      incoming?.topSellingProducts?.["7d"] &&
      incoming.topSellingProducts["7d"].length > 0
        ? incoming.topSellingProducts["7d"]
        : fallback.topSellingProducts["7d"],
    "30d":
      incoming?.topSellingProducts?.["30d"] &&
      incoming.topSellingProducts["30d"].length > 0
        ? incoming.topSellingProducts["30d"]
        : fallback.topSellingProducts["30d"],
  },
  customerInsights: {
    "7d": {
      totalCustomers:
        incoming?.customerInsights?.["7d"]?.totalCustomers ??
        fallback.customerInsights["7d"].totalCustomers,
      newCustomersLabel:
        incoming?.customerInsights?.["7d"]?.newCustomersLabel ??
        fallback.customerInsights["7d"].newCustomersLabel,
      newCustomers:
        incoming?.customerInsights?.["7d"]?.newCustomers ??
        fallback.customerInsights["7d"].newCustomers,
      repeatBuyers:
        incoming?.customerInsights?.["7d"]?.repeatBuyers ??
        fallback.customerInsights["7d"].repeatBuyers,
      locations:
        incoming?.customerInsights?.["7d"]?.locations &&
        incoming.customerInsights["7d"].locations.length > 0
          ? incoming.customerInsights["7d"].locations
          : fallback.customerInsights["7d"].locations,
    },
    "30d": {
      totalCustomers:
        incoming?.customerInsights?.["30d"]?.totalCustomers ??
        fallback.customerInsights["30d"].totalCustomers,
      newCustomersLabel:
        incoming?.customerInsights?.["30d"]?.newCustomersLabel ??
        fallback.customerInsights["30d"].newCustomersLabel,
      newCustomers:
        incoming?.customerInsights?.["30d"]?.newCustomers ??
        fallback.customerInsights["30d"].newCustomers,
      repeatBuyers:
        incoming?.customerInsights?.["30d"]?.repeatBuyers ??
        fallback.customerInsights["30d"].repeatBuyers,
      locations:
        incoming?.customerInsights?.["30d"]?.locations &&
        incoming.customerInsights["30d"].locations.length > 0
          ? incoming.customerInsights["30d"].locations
          : fallback.customerInsights["30d"].locations,
    },
  },
});

export default function AnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const {
    analyticsData: vendorApiAnalytics,
    fetchVendorAnalytics,
  } = useVendorAnalytics();
  const [timeframe] = useState<Timeframe>("7d");

  const isAdmin = user?.role?.toLowerCase().includes("admin");
  const mergedVendorAnalytics = useMemo(
    () => mergeAnalyticsData(vendorAnalytics, vendorApiAnalytics),
    [vendorApiAnalytics]
  );
  const analytics = isAdmin ? adminAnalytics : mergedVendorAnalytics;

  useEffect(() => {
    if (!isAdmin) {
      fetchVendorAnalytics().catch((err) => {
        console.error("Failed to load vendor analytics:", err);
      });
    }
  }, [fetchVendorAnalytics, isAdmin]);

  const revenueSeries = analytics.revenueSeries[timeframe];
  const topProducts = analytics.topSellingProducts[timeframe]
    .slice()
    .sort((a, b) => b.sales - a.sales);
  const customerData = analytics.customerInsights[timeframe];

  const highestRevenue = useMemo(
    () => Math.max(...revenueSeries.map((item) => item.value), 1),
    [revenueSeries]
  );
  const categoryTotal = analytics.salesByCategory.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  const locationTotal = customerData.locations.reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Platform-wide performance across all vendors"
              : "Track your store revenue, sales performance, and customer behavior"}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#8DEB6E] bg-card px-4 py-2 text-sm font-medium text-[#22a85a] transition-opacity hover:opacity-90"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(analytics.summaryCards.totalRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">💰</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {analytics.summaryCards.totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">🛒</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(analytics.summaryCards.avgOrderValue)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">💰</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {analytics.inventorySnapshot.pendingOrders.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg sm:text-xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
          <div className="mt-5 flex items-end gap-3 h-56">
            {revenueSeries.map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-secondary rounded-md h-48 flex items-end p-1">
                  <div
                    title={`${item.label}: ${formatCurrency(item.value)}`}
                    className="w-full rounded transition-all"
                    style={{
                      height: `${Math.max((item.value / highestRevenue) * 100, 8)}%`,
                      backgroundColor: getApprovedAccent(0),
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">Sales by Category</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Category contribution ({categoryTotal}% total)
          </p>
          <div className="space-y-4">
            {analytics.salesByCategory
              .slice()
              .sort((a, b) => b.percentage - a.percentage)
              .map((item, index) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.category}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getApprovedAccent(index),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">Top Selling Products</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 text-left font-medium">PRODUCT</th>
                  <th className="py-2 text-right font-medium">SALES</th>
                  <th className="py-2 text-right font-medium">REVENUE</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.slice(0, 10).map((product) => (
                  <tr key={product.product} className="border-b border-border/60">
                    <td className="py-2 text-foreground">{product.product}</td>
                    <td className="py-2 text-right text-foreground">{product.sales}</td>
                    <td className="py-2 text-right text-foreground">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">Customer Insights</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-secondary/60 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {customerData.totalCustomers.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
            <div className="rounded-md bg-secondary/60 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {customerData.newCustomers.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{customerData.newCustomersLabel}</p>
            </div>
            <div className="rounded-md bg-secondary/60 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {customerData.repeatBuyers.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Repeat Buyers</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Customer Locations ({locationTotal}%)
            </h3>
            <div className="space-y-3">
              {customerData.locations.map((location) => (
                <div key={location.state}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{location.state}</span>
                    <span className="text-sm text-foreground">{location.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${location.percentage}%`,
                        backgroundColor: getApprovedAccent(1),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}