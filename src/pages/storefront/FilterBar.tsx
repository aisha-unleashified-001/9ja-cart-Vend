const FilterBar = () => {
  return (
    <div className="mt-6 px-4 flex items-center justify-between">
      <select className="px-3 py-2 bg-white shadow rounded text-sm">
        <option>Sort: Popular</option>
        <option>Price: Low → High</option>
        <option>Price: High → Low</option>
        <option>Newest</option>
      </select>

      <button className="text-sm text-blue-600 font-medium">Filter ▾</button>
    </div>
  );
};

export default FilterBar;
