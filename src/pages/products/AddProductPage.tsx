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
import type { CreateProductRequest, ProductVariation, ProductFeature } from "@/types";
import { Info, Plus, X, Layers } from "lucide-react";
import { DEFAULT_COMMISSION_PERCENTAGE } from "@/lib/constants";

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
  const PRODUCT_DESCRIPTION_MAX_LENGTH = 500;
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
  const [showMinStockInfo, setShowMinStockInfo] = useState(false);

  // Product Variations state
  const [hasVariations, setHasVariations] = useState(false);
  const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
  const [variationInputs, setVariationInputs] = useState<string[]>([]); // live text input per variation

  // Product Features state
  const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([]);

  // Commission from API - uneditable. Uses DEFAULT_COMMISSION_PERCENTAGE until API provides value.
  // TODO: Replace with API fetch when commission endpoint is available.
  const [commissionPercentage] = useState<number>(DEFAULT_COMMISSION_PERCENTAGE);

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

  // ── Variation helpers ──────────────────────────────────────────────────────

  const VARIATION_PRESETS = ["Size", "Color", "Measurement"];

  const toggleVariations = () => {
    setHasVariations((prev) => {
      if (!prev && productVariations.length === 0) {
        setProductVariations([{ name: "", options: [] }]);
        setVariationInputs([""]);
      }
      return !prev;
    });
  };

  const addVariation = () => {
    setProductVariations((prev) => [...prev, { name: "", options: [] }]);
    setVariationInputs((prev) => [...prev, ""]);
  };

  const removeVariation = (index: number) => {
    setProductVariations((prev) => prev.filter((_, i) => i !== index));
    setVariationInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariationName = (index: number, name: string) => {
    setProductVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, name } : v))
    );
  };

  const addVariationOption = (index: number, option: string) => {
    const trimmed = option.trim();
    if (!trimmed) return;
    setProductVariations((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        if (v.options.includes(trimmed)) return v;
        return { ...v, options: [...v.options, trimmed] };
      })
    );
    setVariationInputs((prev) => prev.map((val, i) => (i === index ? "" : val)));
  };

  const removeVariationOption = (varIndex: number, optIndex: number) => {
    setProductVariations((prev) =>
      prev.map((v, i) =>
        i === varIndex
          ? { ...v, options: v.options.filter((_, oi) => oi !== optIndex) }
          : v
      )
    );
  };

  const handleVariationInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addVariationOption(index, variationInputs[index] || "");
    } else if (
      e.key === "Backspace" &&
      (variationInputs[index] || "") === "" &&
      productVariations[index].options.length > 0
    ) {
      removeVariationOption(index, productVariations[index].options.length - 1);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────

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

    // Validate product variations when enabled
    if (hasVariations) {
      const filledVariations = productVariations.filter(
        (v) => v.name.trim() !== "" || v.options.length > 0
      );
      for (let i = 0; i < filledVariations.length; i++) {
        const v = filledVariations[i];
        if (!v.name.trim()) {
          newErrors.variations = `Variation #${i + 1} must have a name`;
          break;
        }
        if (v.options.length === 0) {
          newErrors.variations = `Variation "${v.name}" must have at least one option`;
          break;
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

      // Build validated variations list (only when toggle is on and variations have data)
      const validatedVariations: ProductVariation[] = hasVariations
        ? productVariations.filter((v) => v.name.trim() !== "" && v.options.length > 0)
        : [];

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
        productVariations: validatedVariations.length > 0 ? validatedVariations : undefined,
        productFeatures: productFeatures.length > 0 ? productFeatures : undefined,
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

  // Price after discount (before commission) - used when discount is applied
  const priceAfterDiscount = (): number => {
    const unitPrice = parseFloat(form.unitPrice) || 0;
    const discountValue = parseFloat(form.discountValue) || 0;
    const discountType = form.discountType;

    if (discountType === "0" || discountValue === 0) {
      return unitPrice;
    }

    if (discountType === "1") {
      const discountAmount = (unitPrice * discountValue) / 100;
      return unitPrice - discountAmount;
    }

    if (discountType === "2") {
      return Math.max(0, unitPrice - discountValue);
    }

    return unitPrice;
  };

  const hasDiscount =
    form.discountType !== "0" && parseFloat(form.discountValue) > 0;

  // Commission is calculated on: unit price (no discount) or discounted price (with discount)
  const priceForCommission = priceAfterDiscount();
  const commissionAmount =
    priceForCommission * (commissionPercentage / 100);

  // Customer Price: unit price or discounted price + commission (commission always added to what customer pays)
  const finalPrice = priceForCommission + commissionAmount;

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
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={form.productDescription}
                      onChange={(e) =>
                        updateForm("productDescription", e.target.value)
                      }
                      maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
                      className="w-full px-3 py-2 pr-16 pb-6 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Describe your product"
                      disabled={isCreating || isSubmitting}
                    />
                    <span className="pointer-events-none absolute bottom-1.5 right-3 text-xs text-muted-foreground">
                      {form.productDescription.length}/{PRODUCT_DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Add Discount
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Commission
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${commissionPercentage}%`}
                    className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                    aria-label="Commission (from API)"
                  />
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
                        What customers will pay (includes commission)
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

                  {hasDiscount ? (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-800 font-medium">
                          Discount amount:
                        </span>
                        <span className="text-orange-600 font-semibold">
                          ₦
                          {(
                            parseFloat(form.unitPrice) - priceAfterDiscount()
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          {form.discountType === "1" &&
                            ` (${form.discountValue}%)`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-1 border-t border-orange-200">
                        <span className="text-orange-800 font-medium">
                          Commission (added to customer price):
                        </span>
                        <span className="text-orange-600 font-semibold">
                          ₦
                          {commissionAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          ({commissionPercentage}%)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-800 font-medium">
                          Commission ({commissionPercentage}% added):
                        </span>
                        <span className="text-orange-600 font-semibold">
                          ₦
                          {commissionAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
                    <div className="relative inline-flex ml-1">
                      <button
                        type="button"
                        onClick={() => setShowMinStockInfo(!showMinStockInfo)}
                        className="p-1 rounded-full text-black hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200"
                        aria-label="Minimum stock information"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      {showMinStockInfo && (
                        <div className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-md bg-white p-2 text-xs text-black shadow-lg border border-gray-200 z-10">
                          This value sets the threshold that alerts you when stock is
                          running low so you can restock before products sell out.
                        </div>
                      )}
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

            {/* Product Features */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Product Features
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Add key attributes like material, weight, or specs. These are shown on the product page.
              </p>

              <div className="space-y-3">
                {productFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={feature.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProductFeatures((prev) =>
                          prev.map((f, i) =>
                            i === index ? { ...f, name: value } : f
                          )
                        );
                      }}
                      placeholder="Feature name (e.g. Material)"
                      className="md:col-span-2 px-3 py-2 border border-border rounded-md bg-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      disabled={isCreating || isSubmitting}
                    />
                    <input
                      type="text"
                      value={feature.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setProductFeatures((prev) =>
                          prev.map((f, i) =>
                            i === index ? { ...f, value } : f
                          )
                        );
                      }}
                      placeholder="Value (e.g. Leather)"
                      className="md:col-span-2 px-3 py-2 border border-border rounded-md bg-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      disabled={isCreating || isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProductFeatures((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      disabled={isCreating || isSubmitting}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md border border-border disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setProductFeatures((prev) => [
                      ...prev,
                      { name: "", value: "" },
                    ])
                  }
                  disabled={isCreating || isSubmitting}
                  className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add feature
                </button>
              </div>
            </div>

            {/* Product Variations */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Product Variations
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      e.g. Size, Color, Measurement
                    </p>
                  </div>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={toggleVariations}
                  disabled={isCreating || isSubmitting}
                  aria-pressed={hasVariations}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
                    hasVariations ? "bg-[#8DEB6E]" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      hasVariations ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {hasVariations && (
                <div className="mt-4 space-y-4">
                  {productVariations.map((variation, vIdx) => (
                    <div
                      key={vIdx}
                      className="border border-border rounded-md p-4 space-y-3 bg-secondary/20"
                    >
                      {/* Variation header row */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={variation.name}
                          onChange={(e) => updateVariationName(vIdx, e.target.value)}
                          placeholder="Variation name (e.g. Size, Color)"
                          disabled={isCreating || isSubmitting}
                          className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariation(vIdx)}
                          disabled={isCreating || isSubmitting}
                          className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          aria-label="Remove variation"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Preset name suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {VARIATION_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            disabled={isCreating || isSubmitting}
                            onClick={() => updateVariationName(vIdx, preset)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition-colors disabled:opacity-50 ${
                              variation.name === preset
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      {/* Options chip input */}
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Options{" "}
                          <span className="text-muted-foreground/60">
                            — press Enter or comma to add
                          </span>
                        </label>
                        <div className="min-h-[42px] px-3 py-2 border border-border rounded-md bg-input focus-within:ring-2 focus-within:ring-ring">
                          <div className="flex flex-wrap gap-2">
                            {variation.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                              >
                                {opt}
                                <button
                                  type="button"
                                  onClick={() => removeVariationOption(vIdx, oIdx)}
                                  disabled={isCreating || isSubmitting}
                                  className="ml-1 text-primary/60 hover:text-primary focus:outline-none disabled:opacity-50"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            <input
                              type="text"
                              value={variationInputs[vIdx] || ""}
                              onChange={(e) =>
                                setVariationInputs((prev) =>
                                  prev.map((val, i) =>
                                    i === vIdx ? e.target.value : val
                                  )
                                )
                              }
                              onKeyDown={(e) =>
                                handleVariationInputKeyDown(e, vIdx)
                              }
                              onBlur={() =>
                                addVariationOption(
                                  vIdx,
                                  variationInputs[vIdx] || ""
                                )
                              }
                              disabled={isCreating || isSubmitting}
                              placeholder={
                                variation.options.length === 0
                                  ? "e.g. S, M, L or Red, Blue..."
                                  : ""
                              }
                              className="flex-1 min-w-[160px] bg-transparent border-none outline-none text-foreground text-sm placeholder-muted-foreground disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariation}
                    disabled={isCreating || isSubmitting}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add another variation
                  </button>

                  {errors.variations && (
                    <ErrorMessage message={errors.variations} className="mt-1" />
                  )}
                </div>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="text-foreground">
                    ₦
                    {commissionAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ({commissionPercentage}%)
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
