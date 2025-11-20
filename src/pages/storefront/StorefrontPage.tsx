// import CategoryCarousel from "./CategoryCarousel";
// import FilterBar from "./FilterBar";
// import ProductList from "./ProductList";
// import StoreHeader from "./StoreHeader";

// const StorefrontPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 pb-10">
//       <StoreHeader />
//       <CategoryCarousel />
//       <FilterBar />
//       <ProductList /> 
//     </div>
//   );
// };

// export default StorefrontPage;

export default function StorefrontPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Storefront</h1>
          <p className="text-muted-foreground">
            Customize your public store appearance
          </p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🏪</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Storefront Builder Coming Soon
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We're creating a powerful storefront customization tool where you'll be able to:
          </p>
          <div className="text-left space-y-2 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Design your custom store layout</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Upload logos and banner images</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Choose from multiple themes</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Customize colors and fonts</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Preview changes in real-time</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-primary">✓</span>
              <span className="text-sm text-muted-foreground">Mobile-responsive design</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Your products are already available through the main marketplace. This feature will give you a dedicated storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
