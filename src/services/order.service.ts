import { apiClient } from "@/lib/api/client";

import type { OrderItem, OrdersQuery, Order, OrdersResponse } from "@/types";

export const ordersService = {
  async getOrders(query?: OrdersQuery) {
    const response = await apiClient.get<OrdersResponse>("/vendor/orders", {
      params: query,
    });

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
