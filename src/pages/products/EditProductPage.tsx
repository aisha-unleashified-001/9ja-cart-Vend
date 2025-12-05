import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { popup } from "@/lib/popup";
import { useProductsStore } from "@/stores/productsStore";
import { useCategories } from "@/hooks/useCategories";
import { useSuspensionCheck } from "@/hooks/useSuspensionCheck";
import { productsService } from "@/services/products.service";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TagsInput } from "@/components/ui/TagsInput";
import type { Product, UpdateProductRequest } from "@/types";

const normalizeIsActiveValue = (value: Product["isActive"]): string =>
  value === "1" || value === 1 || value === true ? "1" : "0";

interface ProductForm {
  productName: string;
  categoryId: string;
  productDescription: string;
  unitPrice: string;
  discountType: string;
  discountValue: string;
  stock: string;
  minStock: string;
  productTags: string[];
  images: File[];
  isActive: string;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSuspended } = useSuspensionCheck();
  
  // Use direct store access
  const product = useProductsStore((state) => state.currentProduct);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);
  const loadingStep = useProductsStore((state) => state.loadingStep);
  const fetchProductDetails = useProductsStore((state) => state.fetchProductDetails);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const clearCurrentProduct = useProductsStore((state) => state.clearCurrentProduct);
  const clearError = useProductsStore((state) => state.clearError);

  const {
    categories,
    isLoading: categoriesLoading,
    fetchCategories,
  } = useCategories();

  const [form, setForm] = useState<ProductForm>({
    productName: "",
    categoryId: "",
    productDescription: "",
    unitPrice: "",
    discountType: "0",
    discountValue: "0",
    stock: "",
    minStock: "",
    productTags: [],
    images: [],
    isActive: "1",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Load product and categories on component mount
  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
    fetchCategories();

    // Cleanup on unmount
    return () => {
      clearCurrentProduct();
      clearError();
    };
  }, [id]);

  // Populate form when product is loaded
  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || "",
        categoryId: product.categoryId || "",
        productDescription: product.productDescription || "",
        unitPrice: product.unitPrice || "",
        discountType: product.discountType || "0",
        discountValue: product.discountValue || "0",
        stock: product.stock || "",
        minStock: product.minStock || "",
        productTags: product.productTags || [],
        images: [], // Start with empty images for new uploads
        isActive: normalizeIsActiveValue(product.isActive),
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!form.productDescription.trim()) {
      newErrors.productDescription = "Product description is required";
    }

    if (!form.unitPrice || parseFloat(form.unitPrice) <= 0) {
      newErrors.unitPrice = "Please enter a valid price";
    }

    if (!form.stock || parseInt(form.stock) < 0) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (!form.minStock || parseInt(form.minStock) < 0) {
      newErrors.minStock = "Please enter a valid minimum stock";
    }

    if (form.productTags.length === 0) {
      newErrors.productTags = "At least one tag is required";
    }

    // Validate discount only when discount type is not "No Discount"
    if (form.discountType !== "0") {
      if (!form.discountValue || parseFloat(form.discountValue) <= 0) {
        newErrors.discountValue = "Discount value is required when discount type is selected";
      } else {
        if (form.discountType === "1" && parseFloat(form.discountValue) > 100) {
          newErrors.discountValue = "Percentage discount cannot exceed 100%";
        }
        if (
          form.discountType === "2" &&
          parseFloat(form.discountValue) >= parseFloat(form.unitPrice)
        ) {
          newErrors.discountValue =
            "Fixed discount cannot be greater than or equal to the price";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSuspended) {
      popup.error("Your account is suspended. You cannot edit products.");
      return;
    }

    if (!validateForm() || !id) {
      popup.error("Please fix the errors in the form");
      return;
    }

    setIsUpdating(true);

    try {
      const productData: UpdateProductRequest = {
        productId: id,
        productName: form.productName,
        categoryId: form.categoryId,
        productDescription: form.productDescription,
        productTags: form.productTags,
        unitPrice: form.unitPrice,
        discountType: form.discountType, // Always send discount type (0, 1, or 2)
        discountValue: form.discountType === "0" ? undefined : form.discountValue,
        stock: form.stock,
        minStock: form.minStock,
        images: [], // Images handled separately
        isActive: form.isActive,
      };

      await updateProduct(productData);
      
      // If user selected new images, upload them after product update
      if (form.images.length > 0) {
        try {
          await productsService.uploadProductImages({
            productId: id,
            images: form.images
          });
          popup.success("Product and images updated successfully!");
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          popup.success("Product updated successfully, but image upload failed. You can try uploading images again.");
        }
      } else {
        popup.success("Product updated successfully!");
      }
      
      navigate(`/products/${id}`);
    } catch {
      popup.error("Failed to update product. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateForm = (field: keyof ProductForm, value: unknown) => {
    const updates: Partial<ProductForm> = { [field]: value };
    
    // Clear discount value when switching to "No Discount"
    if (field === "discountType" && value === "0") {
      updates.discountValue = "0";
    }
    
    setForm((prev) => ({ ...prev, ...updates }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Calculate final price based on discount
  const calculateFinalPrice = (): number => {
    const unitPrice = parseFloat(form.unitPrice) || 0;
    const discountValue = parseFloat(form.discountValue) || 0;
    const discountType = form.discountType;

    if (discountType === "0" || discountValue === 0) {
      return unitPrice;
    }

    if (discountType === "1") {
      // Percentage discount
      const discountAmount = (unitPrice * discountValue) / 100;
      return unitPrice - discountAmount;
    }

    if (discountType === "2") {
      // Fixed amount discount
      return Math.max(0, unitPrice - discountValue);
    }

    return unitPrice;
  };

  const finalPrice = calculateFinalPrice();
  const hasDiscount = form.discountType !== "0" && parseFloat(form.discountValue) > 0;

  // Loading state
  if (isLoading && !product) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
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
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Block access if suspended
  if (isSuspended && product) {
    return (
      <div className="space-y-6">
        <div className="bg-red-600 text-white rounded-lg px-6 py-6 border border-red-700">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                Account Suspended
              </h2>
              <p className="mb-4">
                Your account has been suspended. You cannot edit products at this time.
              </p>
              <Link
                to={`/products/${id}`}
                className="inline-block px-4 py-2 bg-white text-red-600 rounded-md hover:bg-red-50 font-medium transition-colors"
              >
                Back to Product Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Product not found
        </h3>
        <p className="text-muted-foreground mb-4">
          The product you're trying to edit doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link to={`/products/${id}`} className="hover:text-foreground transition-colors">
          {product?.productName || "Product"}
        </Link>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground">
            Update your product information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            disabled={isUpdating}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isUpdating}
            disabled={isSuspended}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSuspended
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isUpdating ? loadingStep || "Updating..." : "Update Product"}
          </LoadingButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={form.productName}
                    onChange={(e) => updateForm("productName", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Enter product name"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.productName && (
                    <ErrorMessage
                      message={errors.productName}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    value={form.productDescription}
                    onChange={(e) =>
                      updateForm("productDescription", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Describe your product"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.productDescription && (
                    <ErrorMessage
                      message={errors.productDescription}
                      className="mt-1"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Unit Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.unitPrice}
                    onChange={(e) => updateForm("unitPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0.00"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.unitPrice && (
                    <ErrorMessage message={errors.unitPrice} className="mt-1" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => updateForm("discountType", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    disabled={isUpdating || isSuspended}
                  >
                    <option value="0">No Discount</option>
                    <option value="1">Percentage (%)</option>
                    <option value="2">Fixed Amount (₦)</option>
                  </select>
                </div>
              </div>

              {form.discountType !== "0" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => updateForm("discountValue", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.discountValue && (
                    <ErrorMessage
                      message={errors.discountValue}
                      className="mt-1"
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.discountType === "1"
                      ? "Enter percentage (0-100)"
                      : "Enter fixed discount amount"}
                  </p>
                </div>
              )}

              {/* Final Price Display */}
              {form.unitPrice && parseFloat(form.unitPrice) > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Customer Price
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {hasDiscount ? "What customers will pay" : "No discount applied"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${hasDiscount ? "text-blue-600" : "text-foreground"}`}>
                        ₦{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {hasDiscount && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₦{parseFloat(form.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {hasDiscount && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-800 font-medium">
                          Discount amount:
                        </span>
                        <span className="text-orange-600 font-semibold">
                          ₦{(parseFloat(form.unitPrice) - finalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {form.discountType === "1" && ` (${form.discountValue}%)`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => updateForm("stock", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.stock && (
                    <ErrorMessage message={errors.stock} className="mt-1" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Minimum Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.minStock}
                    onChange={(e) => updateForm("minStock", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0"
                    disabled={isUpdating || isSuspended}
                  />
                  {errors.minStock && (
                    <ErrorMessage message={errors.minStock} className="mt-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Product Images
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload new images to replace existing ones (optional)
              </p>
              <ImageUpload
                images={form.images}
                onImagesChange={(images) => updateForm("images", images)}
                maxImages={5}
              />
              {errors.images && (
                <ErrorMessage message={errors.images} className="mt-2" />
              )}
            </div>

            {/* Product Tags */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Product Tags *
              </h2>
              <TagsInput
                tags={form.productTags}
                onTagsChange={(tags) => updateForm("productTags", tags)}
                placeholder="Add product tags..."
                maxTags={10}
              />
              {errors.productTags && (
                <ErrorMessage message={errors.productTags} className="mt-2" />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Category *
              </h2>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <select
                  value={form.categoryId}
                  onChange={(e) => updateForm("categoryId", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={isUpdating}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              )}
              {errors.categoryId && (
                <ErrorMessage message={errors.categoryId} className="mt-1" />
              )}
            </div>

            {/* Product Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Product Status
              </h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="1"
                    checked={form.isActive === "1"}
                    onChange={(e) => updateForm("isActive", e.target.value)}
                    disabled={isUpdating}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Active</p>
                      <p className="text-xs text-green-600">
                        Product will be visible to customers
                      </p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isActive"
                    value="0"
                    checked={form.isActive === "0"}
                    onChange={(e) => updateForm("isActive", e.target.value)}
                    disabled={isUpdating}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div>
                      <p className="text-sm font-medium text-red-800">Inactive</p>
                      <p className="text-xs text-red-600">
                        Product will be hidden from customers
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Images:</span>
                  <span className="text-foreground">
                    {form.images.length}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags:</span>
                  <span className="text-foreground">
                    {form.productTags.length}/10
                  </span>
                </div>
                {form.unitPrice && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-foreground">
                      ₦{parseFloat(form.unitPrice).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-foreground">
                    {form.discountType === "0" 
                      ? "No Discount"
                      : form.discountType === "1"
                      ? `${form.discountValue}%`
                      : `₦${parseFloat(form.discountValue || "0").toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-end space-x-2 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            disabled={isUpdating}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isUpdating}
            disabled={isSuspended}
            className={`px-4 py-2 rounded-md transition-colors ${
              isSuspended
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isUpdating ? loadingStep || "Updating..." : "Update Product"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}