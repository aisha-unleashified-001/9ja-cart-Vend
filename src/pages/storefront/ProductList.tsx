import ProductCard from "./ProductCard";

const dummyProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    price: 890000,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "MacBook Air M2",
    price: 1200000,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    name: "Samsung Galaxy S22",
    price: 750000,
    image: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    name: "PlayStation 5",
    price: 680000,
    image: "https://via.placeholder.com/300",
  },
];

const ProductList = () => {
  return (
    <div className="mt-6 px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {dummyProducts.map((product) => (
        <ProductCard key={product.id} item={product} />
      ))}
    </div>
  );
};

export default ProductList;
