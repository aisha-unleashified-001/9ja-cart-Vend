import { apiClient } from "@/lib/api/client";

import type {
  ApiResponse,
  OrdersMetrics,
  OrdersQuery,
  OrdersResponse,
} from "@/types";

type GetOrdersReturn = Promise<ApiResponse<OrdersResponse>>;
type GetOrdersSummaryReturn = Promise<ApiResponse<OrdersMetrics>>;

/** Create stable deduplication key regardless of object key order */
function stableQueryKey(obj: Record<string, unknown> | undefined): string {
  if (!obj || typeof obj !== "object") return "{}";
  const sorted = Object.keys(obj)
    .sort()
    .reduce(
      (acc, k) => {
        acc[k] = obj[k];
        return acc;
      },
      {} as Record<string, unknown>
    );
  return JSON.stringify(sorted);
}

/** Deduplicate concurrent getOrders requests - only when same query */
let ordersInFlight: { key: string; promise: GetOrdersReturn } | null = null;

/** Deduplicate concurrent getOrdersSummary requests */
let ordersSummaryInFlight: GetOrdersSummaryReturn | null = null;

export const ordersService = {
  async getOrders(query?: OrdersQuery): GetOrdersReturn {
    const key = stableQueryKey((query ?? {}) as Record<string, unknown>);
    if (ordersInFlight && ordersInFlight.key === key) {
      return ordersInFlight.promise as ReturnType<
        typeof ordersService.getOrders
      >;
    }

    const promise: GetOrdersReturn = (async () => {
      try {
        const response = await apiClient.get<OrdersResponse>(
          "/vendor/orders",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { params: query } as any
        );

        if (!response.data) {
          throw new Error("No data returned from /vendor/orders");
        }
        return response;
      } finally {
        ordersInFlight = null;
      }
    })();

    ordersInFlight = { key, promise };
    return promise;
  },

  async getOrderItems(orderId: string) {
    const response = await apiClient.get(`/vendor/orders/items/${orderId}`);
    return response;
  },

  async getOrdersSummary(): GetOrdersSummaryReturn {
    if (ordersSummaryInFlight) {
      return ordersSummaryInFlight as ReturnType<
        typeof ordersService.getOrdersSummary
      >;
    }

    const promise: GetOrdersSummaryReturn = (async () => {
      try {
        const response = await apiClient.get<OrdersMetrics>(
          `/vendor/orders/summary`
        );
        return response;
      } finally {
        ordersSummaryInFlight = null;
      }
    })();

    ordersSummaryInFlight = promise;
    return promise;
  },
};
