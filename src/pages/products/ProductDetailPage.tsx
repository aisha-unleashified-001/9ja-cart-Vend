import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductsStore } from "@/stores/productsStore";
import { useSuspensionCheck } from "@/hooks/useSuspensionCheck";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  formatPriceDisplay,
  getProductStatus,
  getStatusColor,
  getStockStatus,
  getStockStatusColor,
} from "@/lib/product.utils";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";
import { ProductDebugPanel } from "@/components/debug/ProductDebugPanel";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSuspended } = useSuspensionCheck();

  // Use direct store access to avoid hook re-render issues
  const product = useProductsStore((state) => state.currentProduct);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const archivedProductIds = useProductsStore((state) => state.archivedProductIds);
  const fetchProductDetails = useProductsStore((state) => state.fetchProductDetails);
  const toggleProductStatus = useProductsStore((state) => state.toggleProductStatus);
  const archiveProduct = useProductsStore((state) => state.archiveProduct);
  const restoreProduct = useProductsStore((state) => state.restoreProduct);
  const clearCurrentProduct = useProductsStore((state) => state.clearCurrentProduct);
  const clearError = useProductsStore((state) => state.clearError);

  // Load product details on component mount
  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }

    // Cleanup on unmount
    return () => {
      clearCurrentProduct();
      clearError();
    };
  }, [id]); // Remove function dependencies to prevent infinite loops

  const handleToggleStatus = async () => {
    if (!product) return;

    if (isSuspended) {
      toast.error("Your account is suspended. You cannot modify products.");
      return;
    }

    try {
      const currentStatus = getProductStatus(product);
      const newStatus = currentStatus !== "active";
      await toggleProductStatus(product.productId, newStatus);
      toast.success("Product status updated successfully");
    } catch (error) {
      // Show error toast but don't let it propagate
      const errorMessage = error instanceof Error ? error.message : "Failed to update product status";
      toast.error(errorMessage);
      console.error("Toggle status error:", error);
    }
  };

  // Check if product is archived by checking the archivedProductIds set
  const isArchived = product ? archivedProductIds.has(product.productId) : false;

  const handleArchiveProduct = async () => {
    if (!product) return;

    if (isSuspended) {
      toast.error("Your account is suspended. You cannot archive products.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to archive this product? This will hide it from your product list."
    );

    if (confirmed) {
      try {
        await archiveProduct(product.productId);
        toast.success("Product archived successfully");
        navigate("/products");
      } catch {
        toast.error("Failed to archive product");
      }
    }
  };

  const handleRestoreProduct = async () => {
    if (!product) return;

    if (isSuspended) {
      toast.error("Your account is suspended. You cannot restore products.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to restore this product? It will be visible in your product list again."
    );

    if (confirmed) {
      try {
        await restoreProduct(product.productId);
        toast.success("Product restored successfully");
        // Refresh product details after restore to reflect the change
        if (id) {
          await fetchProductDetails(id);
        }
        // Navigate back to products list so user can see the restored product
        navigate("/products");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to restore product";
        toast.error(errorMessage);
        console.error("Restore product error:", error);
      }
    }
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <div className="flex space-x-4">
          <button
            onClick={() => id && fetchProductDetails(id)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
          <Link
            to="/products"
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Product not found
        </h3>
        <p className="text-muted-foreground mb-4">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/products"
          className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const status = getProductStatus(product);
  const stockStatus = getStockStatus(product);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.productName}</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {product.productName}
          </h1>
          <div className="flex items-center space-x-4">
            <span
              className={`text-sm px-3 py-1 rounded-full ${getStatusColor(status)}`}
            >
              {status.replace("_", " ")}
            </span>
            <span className="text-sm text-muted-foreground">
              Category: {product.categoryName || "Uncategorized"}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleToggleStatus}
            disabled={isLoading || isSuspended}
            className={`px-4 py-2 border border-border rounded-md transition-colors disabled:opacity-50 ${
              isSuspended
                ? "cursor-not-allowed bg-gray-100 text-gray-500"
                : "text-foreground hover:bg-secondary"
            }`}
            title={isSuspended ? "Account suspended" : status === "active" ? "Deactivate" : "Activate"}
          >
            {status === "active" ? "Deactivate" : "Activate"}
          </button>
          <Link
            to={isSuspended ? "#" : `/products/${product.productId}/edit`}
            onClick={(e) => {
              if (isSuspended) {
                e.preventDefault();
                toast.error("Your account is suspended. You cannot edit products.");
              }
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSuspended
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            title={isSuspended ? "Account suspended - Cannot edit products" : "Edit"}
          >
            Edit
          </Link>
          {isArchived ? (
            <button
              onClick={handleRestoreProduct}
              disabled={isLoading || isSuspended}
              className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                isSuspended
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              title={isSuspended ? "Account suspended" : "Restore"}
            >
              Restore
            </button>
          ) : (
            <button
              onClick={handleArchiveProduct}
              disabled={isLoading || isSuspended}
              className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${
                isSuspended
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              title={isSuspended ? "Account suspended" : "Archive"}
            >
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <ProductImage
            images={product.images || []}
            productName={product.productName}
            className="aspect-square bg-secondary/20 rounded-lg"
            showGallery={true}
          />
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pricing</h3>
            <div className="space-y-2">
              {product.discountType === "0" ? (
                // No discount - show unit price as main price
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Price:</span>
                  <span className="text-xl font-bold text-foreground">
                    {formatPriceDisplay(product.unitPrice)}
                  </span>
                </div>
              ) : (
                // Has discount - show original price, discount, and final price
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Original Price:</span>
                    <span className="text-lg font-semibold text-muted-foreground line-through">
                      {formatPriceDisplay(product.unitPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-sm text-orange-600">
                      {product.discountType === "1" ? "%" : "₦"} {product.discountValue}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-muted-foreground font-medium">Final Price:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPriceDisplay(product.discountPrice)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Stock Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Stock:</span>
                <span className={`font-semibold ${getStockStatusColor(stockStatus)}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Minimum Stock:</span>
                <span className="text-foreground">{product.minStock} units</span>
              </div>
              {stockStatus === "low_stock" && (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-3">
                  <p className="text-orange-800 text-sm font-medium">
                    ⚠️ Low stock warning! Consider restocking soon.
                  </p>
                </div>
              )}
              {stockStatus === "out_of_stock" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                  <p className="text-red-800 text-sm font-medium">
                    🚫 Out of stock! Restock immediately.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Product Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{product.productDescription}</p>
              </div>
              
              {product.productTags && product.productTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.productTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-foreground text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-foreground text-sm">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <ProductImageUpload
            productId={product.productId}
            onUploadSuccess={() => {
              // Refresh product data after successful upload
              fetchProductDetails(product.productId);
            }}
          />
        </div>
      </div>

      {/* Debug Panel (development only) */}
      <ProductDebugPanel product={product} />
    </div>
  );
}