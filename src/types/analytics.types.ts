export type Timeframe = "7d" | "30d";

export type RevenuePoint = {
  label: string;
  value: number;
};

export type CategoryBreakdown = {
  category: string;
  percentage: number;
};

export type AnalyticsTopProduct = {
  product: string;
  sales: number;
  revenue: number;
};

export type CustomerLocation = {
  state: string;
  percentage: number;
};

export type AnalyticsData = {
  inventorySnapshot: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  summaryCards: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    conversionRate: number;
  };
  revenueSeries: Record<Timeframe, RevenuePoint[]>;
  salesByCategory: CategoryBreakdown[];
  topSellingProducts: Record<Timeframe, AnalyticsTopProduct[]>;
  customerInsights: Record<
    Timeframe,
    {
      totalCustomers: number;
      newCustomersLabel: string;
      newCustomers: number;
      repeatBuyers: number;
      locations: CustomerLocation[];
    }
  >;
};
