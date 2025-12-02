import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ordersService } from "@/services/order.service";
import type { Order, OrderItem, OrdersMetrics, OrdersQuery, Pagination } from "@/types";

interface OrdersState {
  orders: Order[];
  metrics: OrdersMetrics | null; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderItems: any[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  query: OrdersQuery;
}

interface OrdersStore extends OrdersState {
  fetchOrders: (query?: Partial<OrdersQuery>) => Promise<void>;
  fetchOrderItems: (orderId: string) => Promise<void>;
  fetchMetrics: () => Promise<void>; // New action
  setQuery: (query: Partial<OrdersQuery>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: OrdersState = {
  orders: [],
  metrics: null,
  orderItems: [],
  pagination: null,
  isLoading: false,
  error: null,
  query: {
    page: 1,
    perPage: 10,
    status: "all",
    // search: "",
    sortBy: "recent",
  },
};

export const useOrdersStore = create<OrdersStore>()(
  devtools((set, get) => ({
    ...initialState,

    fetchOrders: async (queryPayload?: Partial<OrdersQuery>) => {
      set({ isLoading: true, error: null });

      try {
        // Merge current query with new payload
        const currentQuery = { ...get().query, ...queryPayload };

        const cleanQuery = Object.fromEntries(
          Object.entries(currentQuery).filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, v]) => v !== undefined && v !== ""
          )
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await ordersService.getOrders(cleanQuery as any);

        let ordersData: Order[] = [];
        let paginationData: Pagination | null = null;

        if (response?.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const responseData = response as any;
          ordersData = Array.isArray(responseData.data)
            ? responseData.data
            : [];
          paginationData = responseData.pagination ?? null;
        }

        set({
          orders: ordersData,
          pagination: paginationData,
          query: currentQuery, // Keep the full query state in store
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

    fetchMetrics: async () => {
      try {
        const response = (await ordersService.getOrdersSummary()) as
          | { data: OrdersMetrics }
          | null;
        set({ metrics: response?.data ?? null });
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
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
        return { query: newQuery };
      }),

    clearError: () => set({ error: null }),

    reset: () => set(initialState),
  }))
);
