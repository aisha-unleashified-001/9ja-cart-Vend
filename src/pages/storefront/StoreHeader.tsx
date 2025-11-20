const StoreHeader = () => {
  const data = {
    name: "Tech Haven Gadgets",
    logo: "https://via.placeholder.com/100",
    rating: 4.7,
    totalSales: "12.4k",
    verified: true,
  };

  return (
    <div className="bg-white shadow-sm p-6 flex items-center gap-4">
      <img
        src={data.logo}
        alt="store logo"
        className="w-20 h-20 rounded-full border"
      />

      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">{data.name}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
          <span>⭐ {data.rating} Rating</span>
          <span>•</span>
          <span>{data.totalSales} Sales</span>
          {data.verified && (
            <>
              <span>•</span>
              <span className="text-green-600 font-medium">
                ✔ Verified Merchant
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
