const ProductCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-3">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover rounded"
      />

      <h3 className="mt-2 text-sm font-medium">{item.name}</h3>

      <p className="mt-1 font-semibold text-blue-600">
        ₦{item.price.toLocaleString()}
      </p>
    </div>
  );
};

export default ProductCard;
