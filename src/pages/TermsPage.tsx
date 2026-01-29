import { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/homepage/Footer";

export default function TermsPage() {
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
              Terms and Condition
            </h1>
          </div>
        </div>

        {/* Terms content - white card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="bg-card rounded-xl shadow-sm border p-6 md:p-10 text-foreground">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              What are the terms and conditions regarding poorly delivered goods
              or services?
            </h2>
            <p className="text-foreground mb-4">
              If a product is delivered damaged, defective, or not as described,
              you must report it within the stipulated return window (within
              24–72 hours).
            </p>
            <p className="text-foreground mb-2">
              You may be required to provide the following:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>Proof of purchase (order number or receipt)</li>
              <li>Photos/videos of the damaged or incorrect item</li>
            </ul>
            <p className="text-foreground mb-2">
              Once verified, you may be eligible for:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4 ml-2">
              <li>A replacement</li>
              <li>A refund</li>
              <li>Store credit</li>
            </ul>
            <p className="text-foreground">
              Items damaged due to customer misuse or after the return period may
              not be eligible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
