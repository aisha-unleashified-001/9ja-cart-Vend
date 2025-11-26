import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ordersService } from "@/services/order.service";
import type { Order, OrderItem, OrdersQuery, OrdersResponse } from "@/types";

interface OrdersState {
  orders: Order[];
  orderItems: OrderItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination: any;
  isLoading: boolean;
  error: string | null;
  query: OrdersQuery;
}

interface OrdersStore extends OrdersState {
  fetchOrders: (query?: OrdersQuery) => Promise<void>;
  fetchOrderItems: (orderId: string) => Promise<void>;
  setQuery: (query: Partial<OrdersQuery>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: OrdersState = {
  orders: [],
  orderItems: [],
  pagination: null,
  isLoading: false,
  error: null,
  query: {
    page: 1,
    perPage: 10,
    status: "all", // optional
    search: "",
  },
};

export const useOrdersStore = create<OrdersStore>()(
  devtools((set, get) => ({
    ...initialState,

    fetchOrders: async (query?: OrdersQuery) => {
      set({ isLoading: true, error: null });

      try {
        const currentQuery = { ...get().query, ...query };

        const response = await ordersService.getOrders(currentQuery);

        let ordersData: Order[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let paginationData: any = null;

        if (Array.isArray(response)) {
          // service returned an array of orders directly
          ordersData = response as Order[];
          paginationData = null;
        } else if (response && typeof response === "object" && "data" in response) {
          // service returned an OrdersResponse
          const resp = response as OrdersResponse;
          ordersData = resp.data ?? [];
          paginationData = resp.pagination ?? null;
        }

        set({
          orders: ordersData,
          pagination: paginationData,
          query: currentQuery,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch orders";

        set({
          orders: [],
          isLoading: false,
          error: message,
        });
      }
    },

    fetchOrderItems: async (orderId: string) => {
      set({ isLoading: true, error: null });

      try {
        const response = (await ordersService.getOrderItems(orderId)) as {
          data: OrderItem[];
        } | null;

        set({
          orderItems: response?.data ?? [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch order items";

        set({
          orderItems: [],
          isLoading: false,
          error: message,
        });
      }
    },

    setQuery: (payload) =>
      set((state) => {
        const newQuery = { ...state.query, ...payload };

        // Shallow compare to prevent unnecessary re-renders
        const same =
          state.query.page === newQuery.page &&
          state.query.perPage === newQuery.perPage &&
          state.query.status === newQuery.status &&
          state.query.search === newQuery.search;

        if (same) return state; // prevent infinite loop

        return { query: newQuery };
      }),

    clearError: () => set({ error: null }),

    reset: () => set(initialState),
  }))
);
