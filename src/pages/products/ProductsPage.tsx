import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductsStore } from "@/stores/productsStore";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load products on component mount - ONLY ONCE
  useEffect(() => {
    if (!hasInitialized) {
      console.log("🔍 ProductsPage useEffect - fetching products (first time)");
      fetchProducts();
      setHasInitialized(true);
    } else {
      console.log("🔍 ProductsPage useEffect - skipping (already initialized)");
    }
  }, [hasInitialized, fetchProducts]); // Include fetchProducts to satisfy hook dependencies

  // Manual search handler
  const handleSearch = () => {
    if (searchTerm !== "") {
      setQuery({ search: searchTerm, page: 1 });
      fetchProducts({ search: searchTerm, page: 1 });
    } else {
      setQuery({ search: undefined, page: 1 });
      fetchProducts({ search: undefined, page: 1 });
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setQuery({ page });
    fetchProducts({ page });
  };

  const changePerPage = (perPage: number) => {
    setQuery({ page: 1, perPage });
    fetchProducts({ page: 1, perPage });
  };

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

      {/* Search */}
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
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </div>

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
              ? "Try adjusting your search"
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
