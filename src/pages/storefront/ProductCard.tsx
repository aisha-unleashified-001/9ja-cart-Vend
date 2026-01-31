import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/storeFront.types";

/** Normalized product shape for card (supports storefront API and ProductSummary) */
interface NormalizedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  description?: string;
  shortDescription?: string;
  reviewsTotal?: number;
  reviewsAverage?: number;
  inStock?: boolean;
}

function normalizeProduct(product: Product | Record<string, unknown>): NormalizedProduct {
  const p = product as Record<string, unknown>;
  const id = (p.id ?? p.productId) as string;
  const name = (p.name ?? p.productName) as string;
  const price = Number(
    p.price ?? p.currentPrice ?? p.discountPrice ?? p.unitPrice ?? 0
  );
  const originalPrice = p.originalPrice != null ? Number(p.originalPrice) : undefined;
  const unitPrice = p.unitPrice != null ? Number(p.unitPrice) : undefined;
  const discountPrice = p.discountPrice != null ? Number(p.discountPrice) : undefined;
  const discountObj = p.discount as { percentage?: number } | undefined;
  let discountPercentage: number | undefined;
  if (discountObj?.percentage != null) {
    discountPercentage = Number(discountObj.percentage);
  } else if (originalPrice != null && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  } else if (unitPrice != null && discountPrice != null && unitPrice > discountPrice) {
    discountPercentage = Math.round(((unitPrice - discountPrice) / unitPrice) * 100);
  }
  const images = (p.images ?? p.productImages ?? []) as string[];
  const image = p.image as string | undefined;
  const imageUrl = (images[0] ?? image ?? "") as string;
  const description = (p.description ?? p.productDescription) as string | undefined;
  const shortDescription = (p.shortDescription ?? description) as string | undefined;
  const reviewsVal = p.reviews;
  const reviewsTotal = Number(
    typeof reviewsVal === "number" ? reviewsVal : (reviewsVal as { total?: number })?.total ?? 0
  );
  const reviewsAverage = Number(
    p.rating ?? (p.reviews as { average?: number })?.average ?? 0
  );
  const inv = p.inventory as { inStock?: boolean } | undefined;
  const stock = p.stock;
  const inStock =
    inv?.inStock ??
    (typeof stock === "number" ? stock > 0 : typeof stock === "string" ? Number(stock) > 0 : true);

  return {
    id,
    name,
    price,
    originalPrice: originalPrice ?? unitPrice,
    discountPercentage,
    imageUrl,
    description,
    shortDescription,
    reviewsTotal,
    reviewsAverage,
    inStock: Boolean(inStock),
  };
}

/** Truncate to max words and add "..." if longer */
function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "...";
}

export interface ProductCardProps {
  /** Product from storefront API or dashboard */
  product: Product | Record<string, unknown>;
  showQuickAdd?: boolean;
  className?: string;
}

const ProductCard = ({ product, showQuickAdd = true, className }: ProductCardProps) => {

  console.log("Rendering ProductCard for product:", product);
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [addState, setAddState] = useState<"idle" | "loading" | "success">("idle");
  
  const p = normalizeProduct(product);
  console.log("lol", p);
  const showDiscount = (p.discountPercentage ?? 0) > 0;
  const showOriginalPrice =
    p.originalPrice != null && p.originalPrice > p.price;
  const showReviews = (p.reviewsTotal ?? 0) > 0;
  const showQuickAddButton = showQuickAdd && p.inStock;
  const descriptionSnippet = p.shortDescription ?? p.description;
  const displayDescription = descriptionSnippet
    ? truncateWords(descriptionSnippet, 12)
    : "";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${p.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showQuickAddButton || addState !== "idle") return;
    setAddState("loading");
    await new Promise((r) => setTimeout(r, 400));
    setAddState("success");
    setTimeout(() => setAddState("idle"), 1500);
  };

  const rating = Math.min(5, Math.max(0, p.reviewsAverage ?? 0));
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <Link
      to={`/products/${p.id}`}
      className={cn(
        "group flex flex-col h-full cursor-pointer bg-white border-none rounded-none overflow-hidden",
        className
      )}
    >
      {/* Image section */}
      <div className="relative aspect-square bg-[#F9FAFB] overflow-hidden flex-shrink-0">
        <img
          src={p.imageUrl || `/placeholder.png`}
          alt={p.name || "Product image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/300?text=${encodeURIComponent(p.name || "Product")}`;
          }}
        />

        {/* Discount badge */}
        {showDiscount && (
          <span
            className="absolute top-2 left-2 z-20 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-md"
            style={{ backgroundColor: "#DB4444" }}
          >
            -{p.discountPercentage}%
          </span>
        )}

        {/* Action buttons: wishlist, quick view */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleWishlistClick}
            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border-0 shadow-sm hover:bg-gray-50"
            aria-label="Wishlist"
          >
            <Heart
              className={cn("w-4 h-4", wishlisted ? "fill-[#EF4444] text-[#EF4444]" : "text-[#6B7280]")}
            />
          </button>
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur border-0 shadow-sm hover:bg-gray-50"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Quick Add button overlay */}
        {showQuickAddButton && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addState === "loading"}
            className="absolute bottom-0 left-0 right-0 w-full py-2.5 flex items-center justify-center gap-2 text-white font-medium text-sm bg-[#182F38] hover:bg-[#182F38]/90 transition-transform duration-300 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0"
            style={{ backgroundColor: "#182F38" }}
          >
            <ShoppingCart className="w-4 h-4 flex-shrink-0" style={{ marginRight: 8 }} />
            {addState === "idle" && "Add To Cart"}
            {addState === "loading" && "Adding..."}
            {addState === "success" && "Added to Cart"}
          </button>
        )}
      </div>

      {/* Information section */}
      <div
        className="flex flex-col flex-1 p-3 sm:p-4 space-y-1 sm:space-y-1.5 min-h-0"
        style={{
          background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, #8deb6e1a 100%)",
        }}
      >
        <h3 className="font-medium text-[#111827] group-hover:text-[#1E4700] text-sm sm:text-base leading-tight line-clamp-2 transition-colors">
          {p.name}
        </h3>

        {displayDescription && (
          <p className="text-[#4B5563] text-xs sm:text-sm leading-relaxed line-clamp-2">
            {displayDescription}
          </p>
        )}

        {showReviews && (
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0",
                    i <= fullStars
                      ? "text-[#FBBF24] fill-[#FBBF24]"
                      : i === fullStars + 1 && halfStar
                        ? "text-[#FBBF24] fill-[#FBBF24] opacity-50"
                        : "text-[#E5E7EB] fill-[#E5E7EB]"
                  )}
                />
              ))}
            </div>
            <span className="text-[#4B5563] font-medium text-xs sm:text-sm">
              ({p.reviewsTotal})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="text-md font-medium text-[#F87171]">
            ₦{p.price.toLocaleString("en-NG")}
          </span>
          {showOriginalPrice && p.originalPrice != null && (
            <span className="text-xs text-[#9CA3AF] line-through">
              ₦{p.originalPrice.toLocaleString("en-NG")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
