import { Eye, Heart, ShoppingCart, Star } from "lucide-react";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="group flex flex-col gap-2">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F5F5F5] rounded-md overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.productImages[0] || "/placeholder.png"}
          alt={product.productName}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300?text=${encodeURIComponent(
              product.productName || product.name || "Product"
            )}`;
          }}
        />

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-[#00FF66] text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            New
          </span>
        )}
        {/* Calculate discount if originalPrice exists */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-3 left-3 bg-[#DB4444] text-white text-[10px] font-bold px-2 py-1 rounded-sm">
            -
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors">
            <Heart className="w-4 h-4 text-black" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors">
            <Eye className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Add to Cart (Hover) */}
        <button className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 text-sm font-medium translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-black text-sm truncate">
          {product.productName || product.name}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#DB4444] font-medium">
            ₦{product.currentPrice?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              ₦{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-[#FFAD33]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard