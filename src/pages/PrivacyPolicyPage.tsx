import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout title="Privacy Policy">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Agreement Policy
      </h2>
      <p className="text-foreground mb-6">
        At 9jacart.ng, we prioritize building a trustworthy ecosystem for our Buy Now, Pay Later (BNPL) platform by ensuring all vendors (also referred to as "sellers" or "merchants") adhere to the highest standards of legitimacy, authenticity, and operational integrity. This Vendor Agreement Policy ("Policy") is designed to bind vendors legally and operationally to 9jacart.ng, aligning with global best practices such as those from the International Trade Centre (ITC) Guidelines for E-Commerce Platforms, the World Trade Organization (WTO) standards on consumer protection, and Nigeria's Federal Competition and Consumer Protection Act (FCCPA). By onboarding as a vendor, you agree to these terms, which emphasize rigorous verification of your business legitimacy, product authenticity, and compliance to mitigate risks associated with BNPL financing, such as fraud, defaults, and counterfeit goods. This Policy forms a binding contract and is incorporated into the Vendor Terms and Conditions.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
        1. Vendor Onboarding and Legitimacy Verification
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Eligibility Requirements
      </h4>
      <p className="text-foreground mb-3">
        Vendors must be legally registered entities in Nigeria or internationally (for diaspora-focused suppliers), such as sole proprietorships, partnerships, or limited liability companies. Individuals must operate under a registered business name. Proof of legitimacy includes:
      </p>
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-2">
        <li>Valid Corporate Affairs Commission (CAC) registration certificate (for Nigerian entities) or equivalent international business registration.</li>
        <li>Tax Identification Number (TIN) or VAT registration.</li>
        <li>Bank account details verified through our payment gateway partners.</li>
        <li>Physical address verification via utility bills or site visits (virtual for international vendors).</li>
        <li>Minimum operational history of 6 months, with references from at least two verifiable clients or platforms.</li>
      </ol>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Application Process
      </h4>
      <p className="text-foreground mb-4">
        Submit an online application via the vendor dashboard, including the above documents. 9jacart.ng conducts due diligence, including background checks via third-party services (e.g., credit bureaus like CRC Credit Bureau in Nigeria), to confirm no history of fraud, insolvency, or regulatory violations. Approval is granted within 7–14 business days; rejection reasons are provided confidentially.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Ongoing Verification
      </h4>
      <p className="text-foreground mb-4">
        Vendors must annually renew legitimacy proofs and notify us within 7 days of any changes (e.g., ownership, address). We reserve the right to conduct random audits, including unannounced inspections or digital verifications, to ensure continued compliance.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Emphasis on Legitimacy
      </h4>
      <p className="text-foreground mb-4">
        Any misrepresentation of business status (e.g., using fake documents) results in immediate suspension, forfeiture of earnings, and potential legal action under Nigerian fraud laws (e.g., Cybercrimes Act 2015). We report suspected illegitimacy to authorities like the Economic and Financial Crimes Commission (EFCC).
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
        2. Product Authenticity and Listing Standards
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Authenticity Obligations
      </h4>
      <p className="text-foreground mb-3">
        Vendors must guarantee that all products and services listed are 100% authentic, genuine, and free from counterfeits, imitations, or unauthorized replicas. This includes:
      </p>
      <ol className="list-decimal list-inside space-y-2 mb-4 ml-2">
        <li>Sourcing from authorized manufacturers or distributors, with proof (e.g., invoices, certificates of authenticity) available upon request.</li>
        <li>Compliance with intellectual property laws; no listings infringing trademarks, copyrights, or patents.</li>
        <li>For categories like fashion, health, appliances, and groceries: Mandatory certifications (e.g., NAFDAC approval for health/food items, SON conformity for appliances).</li>
        <li>Services (e.g., laundry, travel, Uber/Bolt integrations): Vendors must hold valid licenses (e.g., IATA for travel) and provide authentic bookings.</li>
      </ol>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Listing Requirements
      </h4>
      <p className="text-foreground mb-4">
        All listings must include accurate descriptions, high-quality images, pricing (inclusive of taxes), stock levels, and delivery timelines. Misleading information (e.g., exaggerated claims) is prohibited. BNPL-specific: Vendors must disclose any additional fees or conditions that could affect customer financing.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Quality Assurance
      </h4>
      <p className="text-foreground mb-4">
        Vendors agree to pre-shipment inspections for high-value items. We may require batch testing for authenticity in sensitive categories (e.g., pharmaceuticals via health partners).
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Emphasis on Authenticity
      </h4>
      <p className="text-foreground mb-4">
        Violations (e.g., selling counterfeits) trigger immediate delisting, full refunds to affected customers (funded by vendor), and penalties up to 200% of the transaction value. Repeat offenses lead to permanent termination and blacklisting from our partner networks. We collaborate with brand owners for authenticity verifications and report fakes to regulatory bodies like the Standards Organisation of Nigeria (SON).
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
        3. Operational Binding Obligations
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Integration with BNPL
      </h4>
      <p className="text-foreground mb-4">
        Vendors must cooperate fully with our BNPL processes, including providing real-time stock confirmations to prevent overselling and adjusting orders for credit approvals. For disputes or returns, vendors bear responsibility for product-related issues and must respond within 24 hours.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Payment and Commission Structure
      </h4>
      <p className="text-foreground mb-4">
        9jacart.ng deducts a commission of 3.5% per product. Vendors authorize us to withhold funds for unresolved issues.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Data and Security Compliance
      </h4>
      <p className="text-foreground mb-4">
        Vendors must adhere to our data protection standards (GDPR-inspired for diaspora), using secure APIs for integrations. Sharing customer data without consent is forbidden.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Performance Metrics
      </h4>
      <p className="text-foreground mb-4">
        Maintain a 95%+ order fulfillment rate, &lt;5% return rate due to vendor fault, and positive reviews (&gt;4.0/5). Failure leads to warnings, probation, or termination.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Insurance and Liability
      </h4>
      <p className="text-foreground mb-4">
        Vendors must carry product liability insurance (minimum ₦10 million coverage) and indemnify 9jacart.ng against claims arising from their products/services.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
        4. Termination and Penalties
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Termination Grounds
      </h4>
      <p className="text-foreground mb-4">
        Breach of legitimacy/authenticity, poor performance, or regulatory non-compliance allows immediate termination without notice.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Penalties
      </h4>
      <p className="text-foreground mb-4">
        Include fund forfeiture, legal fees reimbursement, and damages claims. Post-termination, vendors must cease using our branding.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Dispute Resolution for Vendors
      </h4>
      <p className="text-foreground mb-4">
        Internal escalation first; then arbitration under the Lagos Chamber of Commerce rules.
      </p>

      <p className="text-foreground mt-6">
        This Policy ensures all vendors are integral, accountable partners in our BNPL ecosystem, fostering trust and sustainability.
      </p>
    </PolicyPageLayout>
  );
}
