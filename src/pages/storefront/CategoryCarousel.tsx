const categories = [
  { id: 1, name: "Phones", image: "https://via.placeholder.com/200" },
  { id: 2, name: "Laptops", image: "https://via.placeholder.com/200" },
  { id: 3, name: "Accessories", image: "https://via.placeholder.com/200" },
  { id: 4, name: "Gaming", image: "https://via.placeholder.com/200" },
];

const CategoryCarousel = () => {
  return (
    <div className="mt-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[200px] h-[120px] relative rounded-lg overflow-hidden shadow bg-white"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white font-semibold">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
