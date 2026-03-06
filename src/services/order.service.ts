import { apiClient } from "@/lib/api/client";

import type { OrdersQuery, OrdersResponse } from "@/types";

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
let ordersInFlight: { key: string; promise: Promise<unknown> } | null = null;

/** Deduplicate concurrent getOrdersSummary requests */
let ordersSummaryInFlight: Promise<unknown> | null = null;

export const ordersService = {
  async getOrders(query?: OrdersQuery) {
    const key = stableQueryKey((query ?? {}) as Record<string, unknown>);
    if (ordersInFlight && ordersInFlight.key === key) {
      return ordersInFlight.promise as ReturnType<
        typeof ordersService.getOrders
      >;
    }

    const promise = (async () => {
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

  async getOrdersSummary() {
    if (ordersSummaryInFlight) {
      return ordersSummaryInFlight as ReturnType<
        typeof ordersService.getOrdersSummary
      >;
    }

    const promise = (async () => {
      try {
        const response = await apiClient.get(`/vendor/orders/summary`);
        return response;
      } finally {
        ordersSummaryInFlight = null;
      }
    })();

    ordersSummaryInFlight = promise;
    return promise;
  },
};
