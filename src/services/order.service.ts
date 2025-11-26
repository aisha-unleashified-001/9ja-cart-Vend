import { apiClient } from "@/lib/api/client";

import type { OrdersQuery, OrdersResponse } from "@/types";

export const ordersService = {
  async getOrders(query?: OrdersQuery) {
    const response = await apiClient.get<OrdersResponse>(
      "/vendor/orders",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { params: query } as any
    );

    console.log("API /vendor/orders response:", response.data);
    if (!response.data) {
      throw new Error("No data returned from /vendor/orders");
    }
    return response;
  },

  async getOrderItems(orderId: string) {
    const response = await apiClient.get(`/vendor/orders/items/${orderId}`);
    return response.data;
  },
};
