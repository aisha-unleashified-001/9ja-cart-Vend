import { storefrontService } from "@/services/storeFront.service";
import type { Pagination } from "@/types";
import type {
  Category,
  Product,
  StorefrontQuery,
} from "@/types/storeFront.types";
import { create } from "zustand";
import { useAuthStore } from "./authStore";
interface StorefrontState {
  products: Product[];
  bestSellers: Product[];
  categories: Category[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  query: StorefrontQuery;

  isContactSending: boolean;
  contactSuccess: boolean;
}

interface StorefrontActions {
  fetchProducts: (query?: Partial<StorefrontQuery>) => Promise<void>;
  fetchBestSellers: (vendorId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  sendContactMessage: (data: {
    vendorId?: string;
    name: string;
    email: string;
    message: string;
    subject?: string;
  }) => Promise<void>;
  setQuery: (query: Partial<StorefrontQuery>) => void;
  resetContact: () => void;
}

const initialState = {
  products: [],
  bestSellers: [],
  categories: [],
  pagination: null,
  isLoading: false,
  error: null,
  isContactSending: false,
  contactSuccess: false,
  query: {
    page: 1,
    perPage: 10,
    search: "",
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
  },
};

export const useStorefrontStore = create<StorefrontState & StorefrontActions>(
  (set, get) => ({
    ...initialState,

    fetchProducts: async (queryPayload) => {
      set({ isLoading: true, error: null });
      try {
        const user = useAuthStore.getState().user;
        // Prefer vendorId passed in queryPayload, then stored query, then auth store
        const vendorId =
          queryPayload?.vendorId ||
          get().query.vendorId ||
          user?.vendorId ||
          user?.userId;

        if (!vendorId) {
          // Only throw if we strictly need it, otherwise just return
          console.warn(
            "Fetch Products aborted: No Vendor ID found in Auth Store"
          );
          set({ isLoading: false });
          return;
        }

        const currentQuery = { ...get().query, ...queryPayload, vendorId };

        // Merge vendorId into the query object
        const fullQuery = {
          ...currentQuery,
          vendorId, // <--- Key Fix: Passing ID inside the object
        };

        const cleanQuery = Object.fromEntries(
          Object.entries(fullQuery).filter(
            ([_, v]) => v !== undefined && v !== ""
          )
        );

        // Pass single argument
        const response = await storefrontService.getVendorProducts(
          cleanQuery as any
        );

        const data = (response?.data as any) || {};
        

        console.log(data?.products);
        const pagination = data?.pagination || null;

        set({
          products: Array.isArray(data.products) ? data.products : [],
          pagination,
          query: currentQuery,
          isLoading: false,
        });
      } catch (err: any) {
        console.error("Fetch Products Error:", err);
        set({
          isLoading: false,
          error: err.message || "Failed to load products",
        });
      }
    },

    fetchBestSellers: async (vendorIdParam?: string) => {
      try {
        const user = useAuthStore.getState().user;
        const vendorId =
          vendorIdParam ||
          get().query.vendorId ||
          user?.vendorId ||
          user?.userId;

        if (!vendorId) return;

        // Pass single argument with vendorId inside
        const response = await storefrontService.getVendorBestSellers({
          vendorId,
          limit: 5,
          period: "year",
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any)?.data?.bestSellers || [];
        set({ bestSellers: Array.isArray(data) ? data : [] });
      } catch (err) {
        console.error("Failed to fetch best sellers", err);
      }
    },

    fetchCategories: async () => {
      try {
        const response = await storefrontService.getCategories();
        const data = response?.data || [];
        set({ categories: Array.isArray(data) ? data : [] });
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    },

    sendContactMessage: async (payload) => {
      set({ isContactSending: true, error: null });
      try {
        const user = useAuthStore.getState().user;
        const vendorId =
          payload.vendorId ||
          get().query.vendorId ||
          user?.vendorId ||
          user?.userId;

        if (!vendorId) throw new Error("Vendor ID unavailable");

        const { vendorId: _, ...contactData } = payload;
        await storefrontService.contactVendor({
          vendorId,
          ...contactData,
        });
        set({ isContactSending: false, contactSuccess: true });
      } catch (err: any) {
        set({
          isContactSending: false,
          error: err.message || "Failed to send message",
        });
      }
    },

    setQuery: (payload) =>
      set((state) => ({ query: { ...state.query, ...payload } })),

    resetContact: () =>
      set({ isContactSending: false, contactSuccess: false, error: null }),
  })
);
