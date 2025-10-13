import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useProducts, useProductsPagination } from "@/hooks/useProducts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Pagination } from "@/components/ui/Pagination";
import {
  formatPriceDisplay,
  getProductStatus,
  getStatusColor,
  getStockStatus,
  getStockStatusColor,
  getPrimaryImage,
  truncateText,
} from "@/lib/product.utils";

export default function ProductsPage() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    toggleProductStatus,
    setQuery,
  } = useProducts();

  const { pagination, currentPage, perPage, goToPage, changePerPage } =
    useProductsPagination();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);




  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        setQuery({ search: searchTerm, page: 1 });
        fetchProducts({ search: searchTerm, page: 1 });
      } else {
        setQuery({ search: undefined, page: 1 });
        fetchProducts({ search: undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setQuery, fetchProducts]);

  // Handle status filter
  useEffect(() => {
    const isActiveFilter =
      statusFilter === "all"
        ? undefined
        : statusFilter === "active"
        ? "1"
        : "0";
    setQuery({ isActive: isActiveFilter, page: 1 });
    fetchProducts({ isActive: isActiveFilter, page: 1 });
  }, [statusFilter, setQuery, fetchProducts]);

  const handleToggleStatus = async (
    productId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "active";
      await toggleProductStatus(productId, !newStatus);
      toast.success("Product status updated successfully");
    } catch {
      toast.error("Failed to update product status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Product
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={isLoading}
          className="px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && products && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const status = getProductStatus(product);
            const stockStatus = getStockStatus(product);
            const primaryImage = getPrimaryImage(product);

            return (
              <div
                key={product.productId}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-semibold text-foreground"
                      title={product.productName}
                    >
                      {truncateText(product.productName, 25)}
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
                    {truncateText(product.productDescription, 50)}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">
                        {formatPriceDisplay(product.discountPrice)}
                      </span>
                      {product.unitPrice !== product.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPriceDisplay(product.unitPrice)}
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
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 text-center border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
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
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          perPage={perPage}
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
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first product"}
          </p>
          <Link
            to="/products/new"
            className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}
