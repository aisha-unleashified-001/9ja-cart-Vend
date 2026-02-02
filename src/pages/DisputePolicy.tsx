import { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/homepage/Footer";

export default function DisputePolicy() {
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
            Dispute Policy
            </h1>
          </div>
        </div>

        {/* Content - white card */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="bg-card rounded-xl shadow-sm border p-6 md:p-10 text-foreground">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Dispute Resolution Policy
            </h2>
            <p className="text-foreground mb-6">
              Our Dispute Resolution Policy at 9jacart.ng adheres to global standards such as the UNCITRAL Model Law on International Commercial Conciliation and Nigeria's Arbitration and Mediation Act 2023, emphasizing fair, efficient, and accessible mechanisms. We prioritize amicable resolutions to maintain customer trust.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
              Dispute Types and Initiation
            </h3>
            
            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Covered Disputes
            </h4>
            <p className="text-foreground mb-4">
              Include issues related to product quality, delivery delays, billing errors, unauthorized transactions, or service failures. Excludes third-party disputes (e.g., with ride-hailing providers), which are escalated to them.
            </p>

            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Initiation Process
            </h4>
            <p className="text-foreground mb-3">
              Raise disputes within 30 days of the issue via:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
              <li>User dashboard</li>
              <li>Email (disputes@9jacart.ng) or hotline</li>
            </ul>
            <p className="text-foreground mb-4">
              Provide details, evidence (e.g., photos, receipts), and desired outcome.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
              Resolution Steps
            </h3>

            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Step 1: Internal Review (Tier 1)
            </h4>
            <p className="text-foreground mb-4">
              Our support team acknowledges within 24 hours and investigates within 3 business days. Customer must respond with evidence within 1 business day. Resolutions include refunds, replacements, or credits.
            </p>

            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Step 2: Escalation (Tier 2)
            </h4>
            <p className="text-foreground mb-4">
              If unresolved, escalate to a senior mediator within 5 business days for a binding internal decision, incorporating customer feedback.
            </p>

            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Step 3: Mediation/Arbitration (Tier 3)
            </h4>
            <p className="text-foreground mb-4">
              For complex cases, we support mediation via independent neutrals (e.g., Lagos Multi-Door Courthouse). If needed, binding arbitration under Nigerian law, with costs shared between customer and vendor without prejudice to the independence of 9jaCart Limited.
            </p>

            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              Legal Recourse
            </h4>
            <p className="text-foreground mb-4">
              If arbitration fails, disputes are resolved in courts with appropriate jurisdiction under Nigerian law. Class actions are absolutely waived.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
              Timelines and Protections
            </h3>
            <p className="text-foreground mb-4">
              Full resolution targeted within 14–30 days. Customers receive updates every 5 days. Confidential data is protected per our Privacy Policy.
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
              Fraud and Abuse
            </h3>
            <p className="text-foreground mb-4">
              Frivolous disputes may result in account termination and/or legal action, but we assume good faith unless proven otherwise.
            </p>

            <p className="text-foreground mt-6">
              This policy ensures equitable outcomes, with a 95%+ resolution rate in internal tiers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
