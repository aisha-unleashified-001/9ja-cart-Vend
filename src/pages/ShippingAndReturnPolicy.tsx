import { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/homepage/Footer";

export default function ShippingAndReturnPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="flex-1">
        {/* Page title banner - primary green (#1E4700) at 5% opacity */}
        <div className="bg-primary/5 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center">
             Shipping and return policy
            </h1>
          </div>
        </div>

        {/* Content - white card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="bg-card rounded-xl shadow-sm border p-6 md:p-10 text-foreground">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p className="text-foreground mb-2">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Excepteur sint occaecat cupidatat non proident</li>
              <li>Sunt in culpa qui officia deserunt mollit anim id est laborum</li>
            </ul>
            <p className="text-foreground mb-2">
              Curabitur pretium tincidunt lacus. Nulla facilisi:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Vestibulum ante ipsum primis in faucibus</li>
              <li>Orci luctus et ultrices posuere cubilia curae</li>
              <li>Phasellus nec sem in justo pellentesque facilisis</li>
            </ul>
            <p className="text-foreground">
              Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies
              nisi. Nam eget dui. Maecenas tempus, tellus eget condimentum
              rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed
              ipsum.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
