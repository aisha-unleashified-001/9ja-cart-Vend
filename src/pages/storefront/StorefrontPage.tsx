import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Star,
  MapPin,
  CheckCircle,
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Send,
  Copy,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useStorefrontStore } from "@/stores/storeFront";
import ProductCard, { type ProductCardProps } from "./ProductCard";
import { popup } from "@/lib/popup";
import { getVendorStorefrontUrl } from "@/lib/vendor.utils";
import { useBusinessLogo } from "@/hooks/useBusinessLogo";


const PromoBanner = () => {
  return (
    <div className="bg-black rounded-sm p-10 md:p-14 my-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
      <div className="z-10 text-white space-y-8 max-w-lg">
        <span className="text-[#00FF66] font-semibold text-sm">Categories</span>
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
          Enhance Your <br /> Music Experience
        </h2>

        {/* Countdown */}
        <div className="flex gap-4">
          {[
            { val: 23, label: "Hours" },
            { val: 5, label: "Days" },
            { val: 59, label: "Mins" },
            { val: 35, label: "Secs" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-black rounded-full w-16 h-16 flex flex-col items-center justify-center"
            >
              <span className="font-bold text-sm leading-none">{item.val}</span>
              <span className="text-[10px] leading-none mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button className="bg-[#8DEB6E] text-primary px-8 py-3 rounded-sm font-medium hover:bg-[#8DEB6E]/90 transition-colors">
          Buy Now!
        </button>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mt-8 md:mt-0 max-w-lg">
        <img
          src="https://pngimg.com/d/jbl_speaker_PNG31.png"
          alt="JBL Speaker"
          className="w-full drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

const StorefrontPage = () => {
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const vendorIdFromUrl = searchParams.get("vendorId");
  const vendorId = vendorIdFromUrl || user?.vendorId || user?.userId || "";

  const {
    products,
    bestSellers,
    categories,
    pagination,
    query,
    isLoading,
    fetchProducts,
    fetchBestSellers,
    fetchCategories,
    setQuery,
    isContactSending,
    contactSuccess,
    sendContactMessage,
    resetContact,
  } = useStorefrontStore();

  const [search, setSearch] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Get business logo
  const { logoUrl } = useBusinessLogo();
  const storefrontLink = useMemo(() => {
    if (!vendorId) return "";
    
    // Use the buyer app URL from environment configuration
    const baseUrl = getVendorStorefrontUrl(vendorId);

    // Add query parameters if available
    const params = new URLSearchParams();
    if (user?.businessName) params.set("businessName", user.businessName);
    if (user?.storeName) params.set("storeName", user.storeName);
    if (user?.avatarUrl) params.set("avatarUrl", user.avatarUrl);
    if (user?.location) params.set("location", user.location as any);

    const qs = params.toString();
    return `${baseUrl}${qs ? `?${qs}` : ""}`;
  }, [vendorId, user?.businessName, user?.storeName, user?.avatarUrl, user?.location]);

  // Updated state structure to match endpoint expectation
  const [contactForm, setContactForm] = useState({
    fullName: "",
    emailAddress: "",
    subject: "",
    message: "",
  });

  const catDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        catDropdownRef.current &&
        !catDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial Fetch - CRITICAL: Wait for user ID to prevent 401/Logout
  useEffect(() => {
    // Only proceed if we have a valid vendorId (or id).
    if (vendorId) {
      setQuery({ vendorId });
      fetchBestSellers(vendorId);
      fetchProducts({ vendorId });
      fetchCategories();
    }
  }, [vendorId]);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== query.search) {
        setQuery({ search });
        // Only fetch if user is loaded
        if (vendorId) {
          fetchProducts({ search, page: 1, vendorId });
        }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [search, vendorId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    setQuery({ page: newPage });
    fetchProducts({ page: newPage, vendorId });
  };

  const handleCategorySelect = (catId: string) => {
    const newCat = query.category === catId ? "" : catId;
    setQuery({ category: newCat, page: 1 });
    fetchProducts({ category: newCat, page: 1, vendorId });
    setIsCategoryDropdownOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    await sendContactMessage({
      vendorId,
      name: contactForm.fullName,
      email: contactForm.emailAddress,
      message: `${contactForm.subject ? `Subject: ${contactForm.subject}\n\n` : ''}${contactForm.message}`,
    });
  };

  // Helper to find category name for display
  const currentCategoryName =
    categories.find((c) => c.id === query.category)?.categoryName ||
    "All Categories";

  // Helper to get first letter of business name
  const getBusinessInitial = () => {
    const businessName = user?.businessName || user?.storeName || "V";
    return businessName.trim().charAt(0).toUpperCase();
  };

  // Only show active products in All Products section (filter when API provides status/isActive)
  const activeProducts = useMemo(() => {
    return products.filter((p: { status?: string; isActive?: string | number | boolean }) => {
      if (p.status !== undefined) return p.status === "active";
      if (p.isActive !== undefined)
        return p.isActive === true || p.isActive === 1 || p.isActive === "1";
      return true;
    });
  }, [products]);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans relative">
      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setIsContactOpen(false);
                resetContact();
              }}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold text-[#182F38] mb-1">
              Contact Vendor
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Send a message to {user?.fullName || "the vendor"}
            </p>

            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  The vendor will reply to your email shortly.
                </p>
                <button
                  onClick={() => {
                    setIsContactOpen(false);
                    resetContact();
                  }}
                  className="mt-6 text-[#1E4700] font-medium hover:underline"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#1E4700] outline-none"
                    value={contactForm.fullName}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        fullName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#1E4700] outline-none"
                    value={contactForm.emailAddress}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        emailAddress: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Added Subject Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#1E4700] outline-none"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#1E4700] outline-none resize-none"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  disabled={isContactSending}
                  type="submit"
                  className="w-full bg-[#8DEB6E] text-primary py-2.5 rounded text-sm font-medium hover:bg-[#8DEB6E]/90 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isContactSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- Container --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-200 flex items-center justify-center">
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-gray-600 text-2xl font-bold">
                  {getBusinessInitial()}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#182F38]">
                {user?.businessName || "La Porsh Footies"}
              </h1>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin className="w-3 h-3" />
                <span>{user?.storeName || "Lagos, Nigeria"}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="font-bold">5.0</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">144 Reviews</span>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1 text-[#00FF66]">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-center">
            <button
              disabled={!storefrontLink}
              onClick={async () => {
                if (!storefrontLink) return;
                
                try {
                  // Try modern clipboard API first
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(storefrontLink);
                    popup.success("Storefront link copied!");
                  } else {
                    // Fallback for older browsers
                    const textArea = document.createElement("textarea");
                    textArea.value = storefrontLink;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    textArea.style.top = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                      document.execCommand("copy");
                      popup.success("Storefront link copied!");
                    } catch (err) {
                      popup.error("Failed to copy link. Please copy manually.");
                    }
                    document.body.removeChild(textArea);
                  }
                } catch (err) {
                  console.error("Failed to copy link:", err);
                  popup.error("Failed to copy link. Please copy manually.");
                }
              }}
              className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Your Store Link
            </button>
          </div>
        </header>

        {/* 2. Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium text-[#182F38]">
              Products{" "}
              <span className="text-gray-400 text-base">
                ({pagination?.totalItems || 0})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Dropdown with real data */}
            <div className="relative" ref={catDropdownRef}>
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className={`flex items-center justify-between px-4 py-2 border rounded text-sm min-w-[160px] ${
                  query.category
                    ? "border-[#1E4700] text-[#1E4700] bg-green-50"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <span className="truncate max-w-[120px]">
                  {currentCategoryName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 opacity-50 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      !query.category
                        ? "text-[#1E4700] font-semibold bg-gray-50"
                        : "text-gray-600"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        query.category === cat.id
                          ? "text-[#1E4700] font-semibold bg-gray-50"
                          : "text-gray-600"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1E4700]"
              />
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Sort Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4" />
              Sort by
            </button>
          </div>
        </div>

        {/* 3. All Active Products (above Best Sellers) */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-[#182F38] mb-4">
            All Products
          </h3>
          {activeProducts.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setQuery({ category: "", search: "" });
                  fetchProducts({ category: "", search: "", page: 1, vendorId });
                }}
                className="mt-4 text-[#1E4700] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {activeProducts.map((product) => (
                <ProductCard key={product.id || (product as any).productId} product={product as ProductCardProps["product"]} showQuickAdd={false} />
              ))}
            </div>
          )}
        </div>

        {/* 4. Pagination for All Products */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center md:justify-end mb-10">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(query.page - 1)}
                disabled={query.page === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
                (_, i) => {
                  let pageNum = i + 1;
                  if (pagination.totalPages > 5 && query.page > 3) {
                    pageNum = query.page - 2 + i;
                  }

                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
                        query.page === pageNum
                          ? "bg-[#1E4700] text-white"
                          : "border border-gray-300 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(query.page + 1)}
                disabled={query.page === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* 5. Best Sellers Grid */}
        {bestSellers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#182F38] mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              Best Sellers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product as ProductCardProps["product"]} showQuickAdd={false} />
              ))}
            </div>
          </div>
        )}

        {/* 6. Promo Banner - hidden per request */}
        {/* <PromoBanner /> */}
      </div>
    </div>
  );
};

export default StorefrontPage;
