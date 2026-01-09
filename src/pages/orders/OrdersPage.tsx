import { useState, useEffect, useRef } from "react";
import OrdersIcon from "@/assets/Orders.png";
import deliveredIcon from "@/assets/package.png";
import returnsIcon from "@/assets/truck.png";
import canceledIcon from "@/assets/x.png";
import { useOrders } from "@/hooks/useOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import {
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
} from "lucide-react";

const statusColors: Record<string, string> = {
  awaiting_pickup: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  pending: "bg-blue-100 text-blue-700",
  order_confirmed: "bg-purple-100 text-purple-700",
  // Uppercase variants for API compatibility
  PENDING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  // Destructure metrics and fetchMetrics from the hook
  const {
    orders,
    metrics,
    pagination,
    query,
    isLoading,
    fetchOrders,
    fetchMetrics,
    setQuery,
  } = useOrders();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // -- UI State for Dropdowns --
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // -- Local Filter State (for the Filter Menu inputs) --
  const [filterValues, setFilterValues] = useState({
    startDate: query.startDate || "",
    endDate: query.endDate || "",
    paymentMethod: query.paymentMethod || "",
  });

  // Local UI state for Search
  const [search, setSearch] = useState(
    query.customerName || query.orderNo || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [status, setStatus] = useState(query.status ?? "all");

  const currentPage = query.page || 1;
  const totalPages = pagination?.totalPages || 1;

  // Refs for click-outside detection
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local filter state when query changes (e.g. clear filters)
  useEffect(() => {
    setFilterValues({
      startDate: query.startDate || "",
      endDate: query.endDate || "",
      paymentMethod: query.paymentMethod || "",
    });
  }, [query.startDate, query.endDate, query.paymentMethod]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Sync local state if query changes externally
  useEffect(() => {
    const storeSearch = query.orderNo || query.customerName || "";
    if (storeSearch !== debouncedSearch) {
      setSearch(storeSearch);
      setDebouncedSearch(storeSearch);
    }

    const currentStatus = query.status || "all";
    if (currentStatus !== status) setStatus(currentStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.orderNo, query.customerName, query.status]);

  useEffect(() => {
    const mappedStatus = status === "all" ? "" : status.toUpperCase();
    const cleanSearch = debouncedSearch.trim();
    const isOrderNo = cleanSearch.toUpperCase().startsWith("ORD");

    setQuery({
      page: 1,
      status: mappedStatus,
      orderNo: isOrderNo ? cleanSearch : "",
      customerName: !isOrderNo ? cleanSearch : "",
    });
  }, [debouncedSearch, status, setQuery]);

  useEffect(() => {
    const payload = {
      page: query.page,
      perPage: query.perPage,
      status: query.status,
      customerName: query.customerName,
      orderNo: query.orderNo,
      startDate: query.startDate,
      endDate: query.endDate,
      paymentMethod: query.paymentMethod,
      sortBy: query.sortBy,
    };
    fetchOrders(payload);
  }, [
    query.page,
    query.perPage,
    query.status,
    query.customerName,
    query.orderNo,
    query.startDate,
    query.endDate,
    query.paymentMethod,
    query.sortBy,
    fetchOrders,
  ]);

  useEffect(() => {
    if (fetchMetrics) {
      fetchMetrics();
    }
  }, [fetchMetrics]);


  const handleApplyFilter = () => {
    setQuery({
      page: 1,
      startDate: filterValues.startDate,
      endDate: filterValues.endDate,
      paymentMethod: filterValues.paymentMethod,
    });
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setQuery({
      startDate: "",
      endDate: "",
      paymentMethod: "",
    });
    setFilterValues({ startDate: "", endDate: "", paymentMethod: "" });
    setIsFilterOpen(false);
  };

  const handleSort = (sortBy: string) => {
    setQuery({ sortBy });
    setIsSortOpen(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setQuery({ page: currentPage + 1 });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setQuery({ page: currentPage - 1 });
  };

  const handlePageClick = (pageNumber: number) => {
    setQuery({ page: pageNumber });
  };

  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#182F38]">Orders</h1>
      <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-[#182F38]">
        Organize all ordered products
      </p>

      {/* Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          icon={OrdersIcon}
          title="Total orders"
          value={metrics?.totalOrders ?? 0}
        />
        <MetricCard
          icon={deliveredIcon}
          title="Delivered over time"
          value={metrics?.deliveredOrders ?? 0}
        />
        <MetricCard
          icon={returnsIcon}
          title="Returns"
          value={metrics?.returnedOrders ?? 0}
        />
        <MetricCard
          icon={canceledIcon}
          title="Canceled orders"
          value={metrics?.cancelledOrders ?? 0}
        />
      </div>

      {/* Tabs - Horizontal scroll on mobile */}
      <div className="flex gap-4 sm:gap-6 mb-4 sm:mb-6 text-sm text-black overflow-x-auto pb-2 scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
        {[
          { label: "All", value: "all" },
          { label: "Completed", value: "completed" },
          { label: "Processed", value: "pending" },
          { label: "Returned", value: "returned" },
          { label: "Canceled", value: "canceled" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={
              `whitespace-nowrap ${
                status === tab.value
                  ? "text-[#1E4700] font-semibold"
                  : "text-gray-500"
              }`
            }
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Actions - Stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Find Order (Name or ORD-xxx)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#1E4700] text-[#1E4700] rounded px-3 py-2 text-sm w-full sm:w-60 focus:outline-none focus:ring-1 focus:ring-[#1E4700]"
        />

        <div className="flex gap-2 sm:gap-3">
          {/* SORT BUTTON */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5] whitespace-nowrap"
            >
              <span className="hidden sm:inline">Sort By</span>
              <span className="sm:hidden">Sort</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            {isSortOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleSort("recent")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    query.sortBy === "recent"
                      ? "text-[#1E4700] font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSort("oldest")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    query.sortBy === "oldest"
                      ? "text-[#1E4700] font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>

          {/* FILTER BUTTON */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5] whitespace-nowrap"
            >
              Filter
              <Filter className="w-3 h-3" />
            </button>
            {isFilterOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-72 sm:w-80 bg-white border border-gray-100 rounded-lg shadow-xl z-20 p-4 animate-in fade-in zoom-in-95 duration-100 text-[#182F38]">
                <div className="space-y-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="date"
                          value={filterValues.startDate}
                          onChange={(e) =>
                            setFilterValues((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#1E4700] outline-none"
                        />
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="date"
                          value={filterValues.endDate}
                          onChange={(e) =>
                            setFilterValues((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#1E4700] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={filterValues.paymentMethod}
                      onChange={(e) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-[#1E4700] outline-none"
                    >
                      <option value="">All Methods</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleResetFilter}
                      className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded border border-gray-200"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleApplyFilter}
                      className="flex-1 py-1.5 text-xs font-medium text-primary bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5] whitespace-nowrap">
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto min-h-[400px] w-full">
        <table className="w-full text-sm border-separate border-spacing-0 min-w-[1400px]">
          <thead>
            <tr className="text-white bg-[#1E4700] text-left">
              <th className="p-4 w-12 whitespace-nowrap">
                <input type="checkbox" />
              </th>
              <th className="p-4 min-w-[120px] whitespace-nowrap">Order ID</th>
              <th className="p-4 min-w-[110px] whitespace-nowrap">Date</th>
              <th className="p-4 min-w-[140px] whitespace-nowrap">Customer</th>
              <th className="p-4 min-w-[110px] whitespace-nowrap">Total</th>
              <th className="p-4 min-w-[130px] whitespace-nowrap">Order Earning</th>
              <th className="p-4 min-w-[140px] whitespace-nowrap">Payment Method</th>
              <th className="p-4 min-w-[130px] whitespace-nowrap">Order Status</th>
              <th className="p-4 min-w-[130px] whitespace-nowrap">Payment Status</th>
              <th className="p-4 min-w-[100px] whitespace-nowrap">Items</th>
              <th className="p-4 w-12 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-[#182F38]">
                  Loading orders...
                </td>
              </tr>
            ) : orders?.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-10 text-[#182F38]">
                  No orders found.
                </td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              orders.map((order: any) => (
                <tr
                  key={order.orderNo}
                  className="border-b border-neutral-200 text-[#333333] hover:bg-gray-50/50 bg-white"
                >
                  <td className="p-4">
                    <input type="checkbox" />
                  </td>

                  <td className="p-4 whitespace-nowrap">{order.orderNo}</td>
                  <td className="p-4 whitespace-nowrap">{order.createdAt}</td>
                  <td className="p-4 whitespace-nowrap">{order.customerName}</td>
                  <td className="p-4 whitespace-nowrap">₦{order.totalAmount?.toLocaleString()}</td>
                  <td className="p-4 whitespace-nowrap">₦{order.orderEarning?.toLocaleString() || 'N/A'}</td>
                  <td className="p-4 whitespace-nowrap capitalize">{order.paymentMethod || 'N/A'}</td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        statusColors[order.status] ||
                        statusColors[order.status?.toLowerCase()] ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        order.paymentStatus?.toLowerCase() === 'paid' || order.paymentStatus?.toLowerCase() === 'completed'
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus?.toLowerCase() === 'pending' || order.paymentStatus?.toLowerCase() === 'unpaid'
                          ? "bg-yellow-100 text-yellow-700"
                          : order.paymentStatus?.toLowerCase() === 'failed' || order.paymentStatus?.toLowerCase() === 'cancelled'
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.paymentStatus || 'N/A'}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">{order.totalItemsCount} items</td>

                  {/* ACTION COLUMN WITH DROPDOWN */}
                  <td className="p-4 relative text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionId(
                          activeActionId === order.orderNo
                            ? null
                            : order.orderNo
                        );
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        activeActionId === order.orderNo
                          ? "bg-gray-200 text-[#1E4700]"
                          : "hover:bg-gray-100 hover:text-[#1E4700]"
                      }`}
                    >
                      <Ellipsis className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeActionId === order.orderNo && (
                      <>
                        {/* Invisible Backdrop to close menu when clicking outside */}
                        <div
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setActiveActionId(null)}
                        />

                        {/* Menu Items */}
                        <div className="absolute right-10 top-2 w-36 bg-white rounded-lg shadow-xl z-20 border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              setActiveActionId(null);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-[#182F38] hover:bg-gray-50 hover:text-[#1E4700] font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3 min-h-[400px]">
        {isLoading ? (
          <div className="text-center py-10 text-[#182F38]">
            Loading orders...
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-10 text-[#182F38]">
            No orders found.
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orders.map((order: any) => (
            <div
              key={order.orderNo}
              className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Header with Order ID and Actions */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#182F38] truncate">{order.orderNo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{order.createdAt}</p>
                </div>
                <div className="relative ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveActionId(
                        activeActionId === order.orderNo
                          ? null
                          : order.orderNo
                      );
                    }}
                    className={`p-1.5 rounded-full transition-colors border ${
                      activeActionId === order.orderNo
                        ? "bg-gray-200 text-[#1E4700] border-[#1E4700]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-[#1E4700] hover:border-[#1E4700]"
                    }`}
                    aria-label="View order actions"
                  >
                    <Ellipsis className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeActionId === order.orderNo && (
                    <>
                      <div
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setActiveActionId(null)}
                      />
                      <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-xl z-20 border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setActiveActionId(null);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-[#182F38] hover:bg-gray-50 hover:text-[#1E4700] font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium text-[#182F38] truncate ml-2">{order.customerName}</span>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-sm font-semibold text-[#182F38]">₦{order.totalAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Earning</p>
                  <p className="text-sm font-semibold text-[#182F38]">₦{order.orderEarning?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <span
                  className={`px-2 py-1 rounded-lg text-xs ${
                    statusColors[order.status] ||
                    statusColors[order.status?.toLowerCase()] ||
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-lg text-xs ${
                    order.paymentStatus?.toLowerCase() === 'paid' || order.paymentStatus?.toLowerCase() === 'completed'
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus?.toLowerCase() === 'pending' || order.paymentStatus?.toLowerCase() === 'unpaid'
                      ? "bg-yellow-100 text-yellow-700"
                      : order.paymentStatus?.toLowerCase() === 'failed' || order.paymentStatus?.toLowerCase() === 'cancelled'
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.paymentStatus || 'N/A'}
                </span>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span className="capitalize">{order.paymentMethod || 'N/A'}</span>
                <span>{order.totalItemsCount} items</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      <div className="flex flex-wrap justify-center sm:justify-end mt-4 sm:mt-6 gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-[#182F38] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;

          // Show only first, last, current, and adjacent pages on mobile
          const shouldShow = totalPages <= 5 || 
            pageNum === 1 || 
            pageNum === totalPages || 
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

          if (!shouldShow && totalPages > 5) {
            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return <span key={pageNum} className="px-2 text-[#182F38]">...</span>;
            }
            return null;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors border
                ${
                  isActive
                    ? "bg-[#1E4700] text-white border-[#1E4700]"
                    : "bg-white text-[#182F38] border-gray-300 hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-[#182F38] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: number;
}) {
  return (
    <div className="border border-[#1E4700] p-3 sm:p-4 rounded-2xl bg-[#F9FFF5] flex items-center gap-2 sm:gap-3">
      <img
        src={icon}
        alt={title}
        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1E4700] p-2 rounded-full flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm text-[#182F38] truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-[#1E4700]">{value}</p>
      </div>
    </div>
  );
}
