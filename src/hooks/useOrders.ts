import { useEffect } from "react";
import { useOrdersStore } from "@/stores/useOrdersStore";

export function useOrders() {
  const {
    orders,
    pagination,
    query,
    isLoading,
    error,
    fetchOrders,
    setQuery,
    clearError,
  } = useOrdersStore();

  // Automatically refetch whenever the query changes (unless disabled)
  // useEffect(() => {
  //   if (!_autoFetch) return;
  //   fetchOrders(query);
  // }, [
  //   query.page,
  //   query.perPage,
  //   query.status,
  //   query.search,
  //   query.sortBy,
  // ]);

  return {
    orders,
    pagination,
    query,
    isLoading,
    error,
    setQuery,
    fetchOrders,
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
