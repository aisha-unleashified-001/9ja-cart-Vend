import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductsStore } from "@/stores/productsStore";
import { useSuspensionCheck } from "@/hooks/useSuspensionCheck";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Pagination } from "@/components/ui/Pagination";
import {
  formatPriceDisplay,
  getProductStatus,
  getStatusColor,
  getStockStatus,
  getStockStatusColor,
  truncateText,
  getMainDisplayPrice,
  getOriginalPrice,
  shouldShowStrikethrough,
  formatSavingsDisplay,
} from "@/lib/product.utils";
import { ProductImage } from "@/components/products/ProductImage";

type StatusFilter = 'all' | 'active' | 'deactivated' | 'out_of_stock';

const FILTER_OPTIONS: Array<{ value: StatusFilter; label: string; indicatorColor: string }> = [
  { value: 'all', label: 'All Products', indicatorColor: 'bg-blue-500' },
  { value: 'active', label: 'Active', indicatorColor: 'bg-green-500' },
  { value: 'deactivated', label: 'Deactivated', indicatorColor: 'bg-gray-500' },
  { value: 'out_of_stock', label: 'Out of Stock', indicatorColor: 'bg-red-500' },
];

const FILTER_BADGE_LABELS: Record<Exclude<StatusFilter, 'all'>, string> = {
  active: 'Active',
  deactivated: 'Deactivated',
  out_of_stock: 'Out of Stock',
};

const FILTER_BADGE_CLASSES: Record<Exclude<StatusFilter, 'all'>, string> = {
  active: 'bg-green-100 text-green-800',
  deactivated: 'bg-gray-100 text-gray-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

export default function ProductsPage() {
  // Use direct store access to avoid hook re-render issues
  const products = useProductsStore((state) => state.products || []);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const pagination = useProductsStore((state) => state.pagination);
  const query = useProductsStore((state) => state.query);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const toggleProductStatus = useProductsStore(
    (state) => state.toggleProductStatus
  );
  const setQuery = useProductsStore((state) => state.setQuery);
  const { isSuspended } = useSuspensionCheck();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Load products on component mount - ONLY ONCE
  useEffect(() => {
    if (!hasInitialized) {
      console.log('🔍 ProductsPage useEffect - fetching products (first time)');
      fetchProducts({ statusFilter });
      setHasInitialized(true);
    } else {
      console.log("🔍 ProductsPage useEffect - skipping (already initialized)");
    }
  }, [hasInitialized, fetchProducts]); // Include fetchProducts to satisfy hook dependencies

  // Sync statusFilter and searchTerm with query when it changes externally
  useEffect(() => {
    if (query.statusFilter && query.statusFilter !== statusFilter) {
      setStatusFilter(query.statusFilter);
    }
    if (query.search !== undefined && query.search !== searchTerm) {
      setSearchTerm(query.search || "");
    }
  }, [query.statusFilter, query.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  // Manual search handler
  const handleSearch = () => {
    const normalizedSearch = searchTerm.trim();
    const searchQuery = normalizedSearch !== "" ? normalizedSearch : undefined;
    setSearchTerm(normalizedSearch);
    setQuery({ search: searchQuery, page: 1, statusFilter });
    fetchProducts({ search: searchQuery, page: 1, statusFilter });
  };

  // Filter handler
  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    const searchQuery = searchTerm !== "" ? searchTerm : undefined;
    setQuery({ statusFilter: filter, page: 1, search: searchQuery });
    fetchProducts({ statusFilter: filter, page: 1, search: searchQuery });
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setQuery({ page, statusFilter });
    fetchProducts({ page, statusFilter, search: query.search });
  };

  const changePerPage = (perPage: number) => {
    setQuery({ page: 1, perPage, statusFilter });
    fetchProducts({ page: 1, perPage, statusFilter, search: query.search });
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: string
  ) => {
    if (isSuspended) {
      toast.error("Your account is suspended. You cannot modify products.");
      return;
    }

    try {
      const newStatus = currentStatus === "active";
      await toggleProductStatus(productId, !newStatus);
      toast.success("Product status updated successfully");
    } catch (error) {
      // Show error toast but don't let it propagate
      const errorMessage = error instanceof Error ? error.message : "Failed to update product status";
      toast.error(errorMessage);
      console.error("Toggle status error:", error);
    }
  };

  const activeFilter: Exclude<StatusFilter, 'all'> | null =
    statusFilter === 'all' ? null : statusFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link
          to={isSuspended ? "#" : "/products/new"}
          onClick={(e) => {
            if (isSuspended) {
              e.preventDefault();
              toast.error("Your account is suspended. You cannot add products.");
            }
          }}
          className={`px-4 py-2 rounded-md transition-colors ${
            isSuspended
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          title={isSuspended ? "Account suspended - Cannot add products" : "Add Product"}
        >
          Add Product
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Search Bar with Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
        />
        
        {/* Filter Dropdown */}
        <div className="relative filter-dropdown-container">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            disabled={isLoading}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
            title="Filter products"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" 
                clipRule="evenodd" 
              />
            </svg>
            {statusFilter !== 'all' && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
            )}
          </button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-10">
              <div className="py-1">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleFilterChange(option.value);
                      setShowFilterDropdown(false);
                    }}
                    disabled={isLoading}
                    className={`w-full text-left px-4 py-2 hover:bg-secondary transition-colors disabled:opacity-50 ${
                      statusFilter === option.value ? 'bg-secondary font-semibold' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${option.indicatorColor}`}></span>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {/* Active Filter Badge */}
      {activeFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            FILTER_BADGE_CLASSES[activeFilter]
          }`}>
            {FILTER_BADGE_LABELS[activeFilter]}
            <button
              onClick={() => handleFilterChange('all')}
              className="hover:opacity-70"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && products && products?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => {
            const status = getProductStatus(product);
            const stockStatus = getStockStatus(product);

            return (
              <div
                key={product.productId}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <ProductImage
                    images={product.images || []}
                    productName={product.productName}
                    className="aspect-square bg-secondary/20 rounded-t-lg"
                  />
                  {product.discountType !== "0" && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      {product.discountType === "1"
                        ? `${product.discountValue}% OFF`
                        : `₦${parseFloat(
                            product.discountValue
                          ).toLocaleString()} OFF`}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-semibold text-foreground"
                      title={product.productName}
                    >
                      {truncateText(product?.productName ?? "", 25)}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        status
                      )}`}
                    >
                      {status.replace("_", " ")}
                    </span>
                  </div>

                  <p
                    className="text-sm text-muted-foreground mb-2"
                    title={product.productDescription}
                  >
                    {truncateText(product?.productDescription ?? "", 50)}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                      <span
                        className={`text-lg font-bold ${
                          product.discountType !== "0"
                            ? "text-green-600"
                            : "text-foreground"
                        }`}
                      >
                        {formatPriceDisplay(getMainDisplayPrice(product))}
                      </span>
                      {shouldShowStrikethrough(product) && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPriceDisplay(getOriginalPrice(product)!)}
                        </span>
                      )}
                      {product.discountType !== "0" && (
                        <span className="text-xs text-green-600 font-medium">
                          {formatSavingsDisplay(product)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${getStockStatusColor(
                          stockStatus
                        )}`}
                      >
                        Stock: {product.stock}
                      </span>
                      {stockStatus === "low_stock" && (
                        <p className="text-xs text-orange-600">Low stock!</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Category: {product.categoryName || "Uncategorized"}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleStatus(product.productId, status)
                      }
                      disabled={isLoading || isSuspended}
                      className={`flex-1 px-3 py-2 text-center border border-border rounded-md transition-colors disabled:opacity-50 ${
                        isSuspended
                          ? "cursor-not-allowed bg-gray-100 text-gray-500"
                          : "text-foreground hover:bg-secondary"
                      }`}
                      title={isSuspended ? "Account suspended" : status === "active" ? "Deactivate" : "Activate"}
                    >
                      {status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <Link
                      to={`/products/${product.productId}`}
                      className="flex-1 px-3 py-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={query.page || 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          perPage={query.perPage || 10}
          onPageChange={goToPage}
          onPerPageChange={changePerPage}
          isLoading={isLoading}
        />
      )}

      {/* Empty State */}
      {!isLoading && (!products || products.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search or filter"
              : statusFilter === 'active'
              ? "You don't have any active products"
              : statusFilter === 'deactivated'
              ? "You don't have any deactivated products"
              : statusFilter === 'out_of_stock'
              ? "You don't have any out of stock products"
              : "Get started by adding your first product"}
          </p>
          {!isSuspended && (
            <Link
              to="/products/new"
              className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Product
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
