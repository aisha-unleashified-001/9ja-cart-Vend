import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import type { AnalyticsData } from "@/types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const normalizeRevenueSeries = (value: unknown) =>
  asArray(value)
    .map((entry, index) => {
      if (!isRecord(entry)) return null;
      const label =
        asString(entry.label) ??
        asString(entry.day) ??
        asString(entry.date) ??
        asString(entry.week) ??
        `#${index + 1}`;
      const amount =
        asNumber(entry.value) ??
        asNumber(entry.revenue) ??
        asNumber(entry.amount) ??
        asNumber(entry.total);
      if (amount === undefined) return null;
      return { label, value: amount };
    })
    .filter((entry): entry is { label: string; value: number } => Boolean(entry));

const normalizeCategories = (value: unknown) =>
  asArray(value)
    .map((entry) => {
      if (!isRecord(entry)) return null;
      const category =
        asString(entry.category) ??
        asString(entry.categoryName) ??
        asString(entry.name) ??
        asString(entry.label);
      const percentage =
        asNumber(entry.percentage) ??
        asNumber(entry.percent) ??
        asNumber(entry.share);
      if (!category || percentage === undefined) return null;
      return { category, percentage };
    })
    .filter((entry): entry is { category: string; percentage: number } => Boolean(entry));

const normalizeProducts = (value: unknown) =>
  asArray(value)
    .map((entry) => {
      if (!isRecord(entry)) return null;
      const product =
        asString(entry.product) ??
        asString(entry.productName) ??
        asString(entry.name) ??
        asString(entry.title);
      const sales = asNumber(entry.sales) ?? asNumber(entry.unitsSold) ?? asNumber(entry.totalSold);
      const revenue =
        asNumber(entry.revenue) ??
        asNumber(entry.totalRevenue) ??
        asNumber(entry.amount);
      if (!product || sales === undefined || revenue === undefined) return null;
      return { product, sales, revenue };
    })
    .filter(
      (entry): entry is { product: string; sales: number; revenue: number } =>
        Boolean(entry)
    );

const normalizeLocations = (value: unknown) =>
  asArray(value)
    .map((entry) => {
      if (!isRecord(entry)) return null;
      const state =
        asString(entry.state) ??
        asString(entry.city) ??
        asString(entry.location) ??
        asString(entry.name);
      const percentage =
        asNumber(entry.percentage) ??
        asNumber(entry.percent) ??
        asNumber(entry.share);
      if (!state || percentage === undefined) return null;
      return { state, percentage };
    })
    .filter((entry): entry is { state: string; percentage: number } => Boolean(entry));

const normalizeAnalyticsData = (input: unknown): Partial<AnalyticsData> => {
  if (!isRecord(input)) return {};

  const summary = isRecord(input.summaryCards)
    ? input.summaryCards
    : isRecord(input.summary)
    ? input.summary
    : input;

  const inventory = isRecord(input.inventorySnapshot)
    ? input.inventorySnapshot
    : isRecord(input.inventory)
    ? input.inventory
    : input;

  const revenueSeriesRecord = isRecord(input.revenueSeries)
    ? input.revenueSeries
    : isRecord(input.revenueOverview)
    ? input.revenueOverview
    : {};
  const weeklyRevenueOverview = isRecord(input.weeklyRevenueOverview)
    ? input.weeklyRevenueOverview
    : {};

  const topProductsRecord = isRecord(input.topSellingProducts)
    ? input.topSellingProducts
    : isRecord(input.topProducts)
    ? input.topProducts
    : {};

  const customerInsightsRecord = isRecord(input.customerInsights)
    ? input.customerInsights
    : isRecord(input.customers)
    ? input.customers
    : {};

  const customerInsights7d = isRecord(customerInsightsRecord["7d"])
    ? customerInsightsRecord["7d"]
    : customerInsightsRecord;
  const customerInsights30d = isRecord(customerInsightsRecord["30d"])
    ? customerInsightsRecord["30d"]
    : customerInsightsRecord;

  return {
    inventorySnapshot: {
      totalProducts: asNumber(inventory.totalProducts),
      totalOrders: asNumber(inventory.totalOrders),
      totalRevenue: asNumber(inventory.totalRevenue),
      pendingOrders: asNumber(inventory.pendingOrders),
    },
    summaryCards: {
      totalRevenue: asNumber(summary.totalRevenue),
      totalOrders: asNumber(summary.totalOrders),
      avgOrderValue: asNumber(summary.avgOrderValue),
      conversionRate: asNumber(summary.conversionRate),
    },
    revenueSeries: {
      "7d": normalizeRevenueSeries(
        weeklyRevenueOverview.dailyBreakdown ??
        revenueSeriesRecord["7d"] ??
          revenueSeriesRecord.daily ??
          revenueSeriesRecord.weekly ??
          input.revenueTrend
      ),
      "30d": normalizeRevenueSeries(
        revenueSeriesRecord["30d"] ??
          revenueSeriesRecord.monthly ??
          revenueSeriesRecord.last30Days ??
          input.revenueTrend
      ),
    },
    salesByCategory: normalizeCategories(
      input.salesByCategory ??
        input.topCategories ??
        input.categoryBreakdown ??
        input.categories
    ),
    topSellingProducts: {
      "7d": normalizeProducts(
        topProductsRecord["7d"] ??
          topProductsRecord.daily ??
          topProductsRecord.weekly ??
          input.topProducts
      ),
      "30d": normalizeProducts(
        topProductsRecord["30d"] ??
          topProductsRecord.monthly ??
          topProductsRecord.last30Days ??
          input.topProducts
      ),
    },
    customerInsights: {
      "7d": {
        totalCustomers:
          asNumber(customerInsights7d.totalCustomers) ?? asNumber(input.totalCustomers),
        newCustomersLabel: asString(customerInsights7d.newCustomersLabel) ?? "New This Week",
        newCustomers:
          asNumber(customerInsights7d.newCustomers) ??
          asNumber(customerInsights7d.newCustomersCurrentMonth) ??
          asNumber(input.newCustomers),
        repeatBuyers:
          asNumber(customerInsights7d.repeatBuyers) ?? asNumber(input.repeatBuyers),
        locations: normalizeLocations(
          customerInsights7d.locations ??
            customerInsights7d.customerLocations ??
            customerInsights7d.geographicDistribution ??
            input.customerLocations
        ),
      },
      "30d": {
        totalCustomers:
          asNumber(customerInsights30d.totalCustomers) ?? asNumber(input.totalCustomers),
        newCustomersLabel: asString(customerInsights30d.newCustomersLabel) ?? "New This Month",
        newCustomers:
          asNumber(customerInsights30d.newCustomers) ??
          asNumber(customerInsights30d.newCustomersCurrentMonth) ??
          asNumber(input.newCustomers),
        repeatBuyers:
          asNumber(customerInsights30d.repeatBuyers) ?? asNumber(input.repeatBuyers),
        locations: normalizeLocations(
          customerInsights30d.locations ??
            customerInsights30d.customerLocations ??
            customerInsights30d.geographicDistribution ??
            input.customerLocations
        ),
      },
    },
  } as unknown as Partial<AnalyticsData>;
};

export class AnalyticsService {
  async getVendorAnalytics(): Promise<Partial<AnalyticsData>> {
    try {
      const response = await apiClient.get<Record<string, unknown>>(
        API_ENDPOINTS.VENDOR.ANALYTICS,
        { requiresAuth: true }
      );

      if (response.error) {
        throw new Error(response.message || "Failed to fetch analytics");
      }

      return normalizeAnalyticsData(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch analytics";
      throw new Error(errorMessage);
    }
  }
}

export const analyticsService = new AnalyticsService();
