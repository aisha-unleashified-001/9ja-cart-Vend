import { useState, useEffect } from "react";
import OrdersIcon from "@/assets/Orders.png";
import deliveredIcon from "@/assets/package.png";
import returnsIcon from "@/assets/truck.png";
import canceledIcon from "@/assets/x.png";
import { useOrders } from "@/hooks/useOrders";
import { ArrowUpDown, FileOutput, Filter, MoreHorizontal } from "lucide-react";

const statusColors: Record<string, string> = {
  awaiting_pickup: "bg-yellow-100 text-yellow-700",
  order_delivered: "bg-green-100 text-green-700",
  order_cancelled: "bg-red-100 text-red-700",
  order_processed: "bg-blue-100 text-blue-700",
  order_confirmed: "bg-purple-100 text-purple-700",
};

const TABS = [
  { label: "All", value: "all" },
  { label: "Completed", value: "order_delivered" },
  { label: "Processed", value: "order_processed" },
  { label: "Returned", value: "returned" },
  { label: "Canceled", value: "order_cancelled" },
];

export default function OrdersPage() {
  const { orders, pagination, query, isLoading, fetchOrders, setQuery } =
    useOrders();

  const limit = query.perPage ?? 10;
  const totalCount = pagination?.count ?? 0;

  const [search, setSearch] = useState(query.search ?? "");
  const [status, setStatus] = useState(query.status ?? "all");
  const [sortBy, setSortBy] = useState("recent");

  // Fetch on query change
  useEffect(() => {
    fetchOrders(query);
  }, [query.page, query.perPage, query.status, query.search, query.sortBy]);

  // Sync UI → Query
  useEffect(() => {
    const mappedStatus = status === "all" ? "" : status;
    setQuery({
      search,
      status: mappedStatus,
      page: 1,
      sortBy,
    });
  }, [search, status, sortBy]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-2 text-[#182F38]">Orders</h1>
      <p className="text-sm mb-6 text-[#182F38]">
        Organize all ordered products
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={OrdersIcon}
          title="Total orders"
          value={pagination?.metrics?.totalOrders ?? 0}
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
        {TABS.map((tab) => (
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

      {/* Search + Sort + Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Find Order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#1E4700] text-[#1E4700] rounded px-3 py-2 text-sm w-60"
        />

        <div className="flex gap-3">
          <button
            onClick={() => setSortBy(sortBy === "recent" ? "oldest" : "recent")}
            className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>

          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button className="border border-[#1E4700] text-[#1E4700] px-3 py-2 rounded text-sm flex items-center gap-2">
            <FileOutput className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse rounded-md">
        <thead>
          <tr className="border-b border-[#1E4700] text-white bg-[#1E4700] text-left p-4">
            <th className="p-3">
              <input type="checkbox" />
            </th>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Items</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-10 text-[#182F38]">
                Loading orders...
              </td>
            </tr>
          ) : (orders?.length ?? 0) === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-10 text-[#182F38]">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order: any) => (
              <tr
                key={order.orderNo}
                className="border-b border-neutral-800 text-[#333333]"
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
                      statusColors[order.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{order.totalItemsCount} items</td>

                <td className="cursor-pointer">
                  <MoreHorizontal className="w-6 h-6 text-[#1E4700]" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        {Array.from({ length: Math.ceil(totalCount / limit) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setQuery({ page: i + 1 })}
            className={`px-3 py-1 rounded 
                ${
                  query.page === i + 1
                    ? "bg-[#1E4700] text-white"
                    : "bg-neutral-300 text-black"
                }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: number;
}) {
  return (
    <div className="border border-[#1E4700] p-4 rounded-2xl bg-[#F9FFF5] flex items-center gap-3">
      <div className="w-12 h-12 bg-[#1E4700] p-2 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-[#182F38]">{title}</p>
        <p className="text-2xl font-bold text-[#1E4700]">{value}</p>
      </div>
    </div>
  );
}
