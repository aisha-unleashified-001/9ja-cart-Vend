import { useEffect } from "react";
import { useOrdersStore } from "@/stores/useOrdersStore";

export function useOrders() {
  const {
    orders,
    metrics,
    pagination,
    query,
    isLoading,
    error,
    fetchOrders,
    fetchMetrics,
    setQuery,
    clearError,
  } = useOrdersStore();

  return {
    orders,
    metrics,
    pagination,
    query,
    isLoading,
    error,
    setQuery,
    fetchOrders,
    fetchMetrics,
    clearError,
  };
}

export function useOrderItems(orderId?: string) {
  const { orderItems, isLoading, error, fetchOrderItems, clearError } =
    useOrdersStore();

  useEffect(() => {
    if (!orderId) return;
    fetchOrderItems(orderId);
  }, [orderId]);

  return { orderItems, isLoading, error, fetchOrderItems, clearError };
}
