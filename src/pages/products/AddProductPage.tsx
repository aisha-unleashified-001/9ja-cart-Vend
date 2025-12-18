import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { popup } from "@/lib/popup";
import { useProducts } from "@/hooks/useProducts";
import { productsService } from "@/services/products.service";
import { useCategories } from "@/hooks/useCategories";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { TagsInput } from "@/components/ui/TagsInput";
import type { CreateProductRequest } from "@/types";
import { Info } from "lucide-react";

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
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const { createProduct, isLoading: isCreating, loadingStep } = useProducts();
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
    discountType: "0", // Default to no discount
    discountValue: "0",
    stock: "",
    minStock: "",
    productTags: [],
    images: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log("📊 Categories updated:", {
      count: categories.length,
      categories: categories.map((c) => ({ id: c.id, name: c.categoryName })),
    });
  }, [categories]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (form.images.length === 0) {
      newErrors.images = "Please upload at least one product image";
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

    // Images are no longer required during creation - they can be added later

    if (form.productTags.length === 0) {
      newErrors.productTags = "At least one tag is required";
    }

    // Validate discount only when discount type is not "No Discount"
    if (form.discountType !== "0") {
      if (!form.discountValue || parseFloat(form.discountValue) <= 0) {
        newErrors.discountValue =
          "Discount value is required when discount type is selected";
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

    const isValid = validateForm();

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      popup.error(firstError);
      //  || "Please fix the errors in the form"
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate category is selected
      if (!form.categoryId || form.categoryId.trim() === "") {
        setIsSubmitting(false);
        popup.error("Please select a valid category");
        setErrors((prev) => ({ ...prev, categoryId: "Please select a category" }));
        return;
      }

      // Ensure categories are loaded
      if (!categories || categories.length === 0) {
        setIsSubmitting(false);
        console.error("❌ Categories not loaded yet");
        popup.error("Categories are still loading. Please wait a moment and try again.");
        return;
      }

      // Debug: Log categories and form data
      console.log("🔍 Debug - Categories and form state:", {
        formCategoryId: form.categoryId,
        formCategoryIdType: typeof form.categoryId,
        categoriesCount: categories.length,
        categories: categories.map((c) => ({
          id: c.id,
          idType: typeof c.id,
          name: c.categoryName,
          match: c.id === form.categoryId,
          trimmedMatch: String(c.id).trim() === String(form.categoryId).trim(),
        })),
      });

      // Verify the selected category exists in the categories list
      // Try multiple matching strategies to be robust
      let selectedCategory = categories.find(
        (cat) => String(cat.id).trim() === String(form.categoryId).trim()
      );

      // If not found by ID, try matching by category name
      if (!selectedCategory) {
        console.warn("⚠️ Category not found by ID, trying to match by name...");
        const categoryByName = categories.find(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            form.categoryId.trim().toLowerCase()
        );

        if (categoryByName) {
          console.log(
            "✅ Found category by name, using correct ID:",
            { oldId: form.categoryId, newId: categoryByName.id }
          );
          selectedCategory = categoryByName;
          // Don't mutate form directly here, we'll use selectedCategory.id for the request
        }
      }

      if (!selectedCategory) {
        console.error("❌ Selected category not found in categories list:", {
          categoryId: form.categoryId,
          availableCategories: categories.map((c) => ({ id: c.id, name: c.categoryName })),
        });
        
        // Debug: Log keys of the first category to see what the ID field is actually called
        if (categories.length > 0) {
          console.log("🔍 Category Object Keys:", Object.keys(categories[0]));
        }

        setIsSubmitting(false);
        popup.error("Selected category is invalid. Please select a different category.");
        setErrors((prev) => ({ ...prev, categoryId: "Invalid category selected" }));
        return;
      }

      // Ensure we have a valid ID
      if (!selectedCategory.id) {
        setIsSubmitting(false);
        console.error("❌ Selected category has no ID:", selectedCategory);
        popup.error("Selected category data is incomplete. Please report this issue.");
        return;
      }

      console.log("✅ Selected category:", {
        id: selectedCategory.id,
        name: selectedCategory.categoryName,
      });

      const productData: CreateProductRequest = {
        productName: form.productName,
        categoryId: selectedCategory.id, // Use the resolved category ID
        productDescription: form.productDescription,
        productTags: form.productTags,
        unitPrice: form.unitPrice,
        discountType: form.discountType, // Always send discount type (0, 1, or 2)
        discountValue:
          form.discountType === "0" ? undefined : form.discountValue,
        stock: form.stock,
        minStock: form.minStock,
        images: [], // No images during creation
        isActive: "1", // Active by default
      };

      const createdProduct = await createProduct(productData);

      // If user selected images, upload them after product creation
      if (form.images.length > 0) {
        try {
          await productsService.uploadProductImages({
            productId: createdProduct.productId,
            images: form.images,
          });
        } catch (imageError) {
          console.error("Image upload failed:", imageError);
        }
      }

      // Show success popup - keep loading state active until popup is visible
      popup.success("Product created successfully.");
      
      // Keep loader visible for a brief moment to ensure success modal is shown
      // This prevents users from clicking multiple times
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsSubmitting(false);
      navigate("/products");
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create product. Please try again.";
      popup.error(errorMessage);
      console.error("Product creation failed:", error);
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
  const hasDiscount =
    form.discountType !== "0" && parseFloat(form.discountValue) > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Add Product
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create a new product for your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={isCreating || isSubmitting}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isCreating || isSubmitting}
            className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
          >
            {(isCreating || isSubmitting) ? loadingStep || "Creating..." : "Create Product"}
          </LoadingButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
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
                    disabled={isCreating || isSubmitting}
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
                    disabled={isCreating || isSubmitting}
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
                    disabled={isCreating || isSubmitting}
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
                    disabled={isCreating || isSubmitting}
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
                    onChange={(e) =>
                      updateForm("discountValue", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0"
                    disabled={isCreating || isSubmitting}
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
                        {hasDiscount
                          ? "What customers will pay"
                          : "No discount applied"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          hasDiscount ? "text-blue-600" : "text-foreground"
                        }`}
                      >
                        ₦
                        {finalPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      {hasDiscount && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₦
                          {parseFloat(form.unitPrice).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
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
                          ₦
                          {(
                            parseFloat(form.unitPrice) - finalPrice
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          {form.discountType === "1" &&
                            ` (${form.discountValue}%)`}
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
                    disabled={isCreating || isSubmitting}
                  />
                  {errors.stock && (
                    <ErrorMessage message={errors.stock} className="mt-1" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground mb-1">
                    <span>Minimum Stock *</span>
                    <div className="relative inline-flex group ml-1">
                      <button
                        type="button"
                        className="p-1 rounded-full text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                        aria-label="Minimum stock information"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <div className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-md bg-blue-50 p-2 text-xs text-blue-800 shadow-lg border border-blue-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                        This value sets the threshold that alerts you when stock is
                        running low so you can restock before products sell out.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={form.minStock}
                    onChange={(e) => updateForm("minStock", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="0"
                    disabled={isCreating || isSubmitting}
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
                Product Images *
              </h2>
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
                <>
                  <select
                    value={form.categoryId}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      console.log("🔍 Category selection changed:", {
                        selectedValue,
                        availableCategories: categories.map((c) => ({
                          id: c.id,
                          name: c.categoryName,
                        })),
                      });
                      updateForm("categoryId", selectedValue);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    disabled={isCreating || isSubmitting}
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
                </>
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
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Active</p>
                    <p className="text-xs text-green-600">
                      Product will be visible to customers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span className="text-foreground">
                    {form.images.length}/5{" "}
                    {form.images.length === 0 ? "(optional)" : ""}
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
                      : `₦${parseFloat(
                          form.discountValue || "0"
                        ).toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={isCreating || isSubmitting}
            className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            isLoading={isCreating || isSubmitting}
            className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors"
          >
            {(isCreating || isSubmitting) ? loadingStep || "Creating..." : "Create Product"}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
