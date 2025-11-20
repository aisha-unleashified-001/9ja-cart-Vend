import { useState } from "react";
import toast from "react-hot-toast";
import { productsService } from "@/services/products.service";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useProductsStore } from "@/stores/productsStore";
import type { UploadProductImagesRequest } from "@/types";

interface ProductImageUploadProps {
  productId: string;
  existingImages?: string[];
  onUploadSuccess?: () => void;
}

export function ProductImageUpload({
  productId,
  existingImages,
  onUploadSuccess,
}: ProductImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function urlToFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsUploading(true);

    try {
      const existingImageFiles = existingImages
        ? await Promise.all(
            existingImages.map((url, idx) =>
              urlToFile(url, `existing-${idx}.jpg`)
            )
          )
        : [];

      // Combine old + new images
      const allFiles: File[] = [...existingImageFiles, ...images];

      // Create request that matches your interface
      const payload: UploadProductImagesRequest = {
        productId,
        images: allFiles,
      };

      await productsService.uploadProductImages(payload);

      // await productsService.uploadProductImages({
      //   productId,
      //   images,
      // });

      toast.success(`Successfully uploaded ${images.length} image(s)!`);
      setImages([]); // Clear selected images
      onUploadSuccess?.(); // Callback to refresh product data
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload images";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Add Product Images
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add new images to your product. These will be added to any existing
        images.
      </p>

      <div className="space-y-4">
        <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {images.length} image(s) selected
          </span>

          <div className="flex space-x-2">
            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setImages([])}
                disabled={isUploading}
                className="px-3 py-2 text-sm border border-border rounded-md text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            )}

            <LoadingButton
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={images.length === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-300"
            >
              {isUploading
                ? "Uploading..."
                : `Upload ${
                    images.length > 0 ? `${images.length} Image(s)` : "Images"
                  }`}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
