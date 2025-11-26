import { useState, useEffect } from "react";
import OrdersIcon from "@/assets/Orders.png";
import deliveredIcon from "@/assets/package.png";
import returnsIcon from "@/assets/truck.png";
import canceledIcon from "@/assets/x.png";
import { useOrders } from "@/hooks/useOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import { Ellipsis, ChevronLeft, ChevronRight } from "lucide-react";

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
  const { orders, pagination, query, isLoading, fetchOrders, setQuery } =
    useOrders();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Local UI state
  const [search, setSearch] = useState(query.search ?? "");
  const [status, setStatus] = useState(query.status ?? "all");

  const currentPage = query.page || 1;
  const totalPages = pagination?.totalPages || 1;

  useEffect(() => {
    if (query.search !== undefined) setSearch(query.search);
    if (query.status !== undefined) setStatus(query.status || "all");
  }, [query.search, query.status]);

  // Update query ONLY when status changes (Server side filter)
  useEffect(() => {
    const mappedStatus = status === "all" ? "" : status;

    if (query.status === mappedStatus && query.page === 1) {
      return;
    }

    setQuery({
      status: mappedStatus,
      page: 1,
      // Search 
    });
  }, [status]);

  useEffect(() => {
    fetchOrders(query);
  }, [query.page, query.perPage, query.status, query.search]);

  // Client-side filtering to ensure tab consistency AND Search
  const filteredOrders =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orders?.filter((order: any) => {
      const matchesStatus =
        status === "all" ||
        order.status?.toLowerCase() === status.toLowerCase();

      // 2. Search Filter (Frontend only)
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        order.orderNo?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.totalAmount?.toString().includes(searchLower);

      return matchesStatus && matchesSearch;
    }) ?? [];

  // Pagination Handlers
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
    <div className="p-6 text-white min-h-screen">
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-2 text-[#182F38]">Orders</h1>
      <p className="text-sm mb-6 text-[#182F38]">
        Organize all ordered products
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={OrdersIcon}
          title="Total orders"
          value={pagination?.totalItems ?? 0}
        />
        <MetricCard
          icon={deliveredIcon}
          title="Delivered over time"
          value={pagination?.metrics?.delivered ?? 0}
        />
        <MetricCard
          icon={returnsIcon}
          title="Returns"
          value={pagination?.metrics?.returns ?? 0}
        />
        <MetricCard
          icon={canceledIcon}
          title="Canceled orders"
          value={pagination?.metrics?.cancelled ?? 0}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 text-sm text-black">
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
              status === tab.value
                ? "text-[#1E4700] font-semibold"
                : "text-gray-500"
            }
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Actions */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Find Order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#1E4700] text-[#1E4700] rounded px-3 py-2 text-sm w-60 focus:outline-none focus:ring-1 focus:ring-[#1E4700]"
        />

        <div className="flex gap-3">
          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5]">
            Sort By
          </button>
          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5]">
            Filter
          </button>
          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm hover:bg-[#F9FFF5]">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-visible min-h-[400px]">
        <table className="w-full text-sm border-collapse rounded-md">
          <thead>
            <tr className="border-b border-[#1E4700] text-white bg-[#1E4700] text-left p-4">
              <th className="p-3 w-10">
                <input type="checkbox" />
              </th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[#182F38]">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[#182F38]">
                  No orders found.
                </td>
              </tr>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filteredOrders.map((order: any) => (
                <tr
                  key={order.orderNo}
                  className="border-b border-neutral-800 text-[#333333] hover:bg-gray-50/50"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>

                  <td>{order.orderNo}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.customerName}</td>
                  <td>₦{order.totalAmount?.toLocaleString()}</td>

                  <td>
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

                  <td>{order.totalItemsCount} items</td>

                  {/* ACTION COLUMN WITH DROPDOWN */}
                  <td className="relative px-4 text-center">
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

      {/* Pagination */}
      <div className="flex justify-end mt-6 gap-2">
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
    <div className="border border-[#1E4700] p-4 rounded-2xl bg-[#F9FFF5] flex items-center gap-3">
      <img
        src={icon}
        alt={title}
        className="w-12 h-12 bg-[#1E4700] p-2 rounded-full"
      />
      <div>
        <p className="text-sm text-[#182F38]">{title}</p>
        <p className="text-2xl font-bold text-[#1E4700]">{value}</p>
      </div>
    </div>
  );
}
