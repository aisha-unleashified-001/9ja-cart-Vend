import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export default function TermsPage() {
  return (
    <PolicyPageLayout title="Vendor Terms and Conditions">
      <p className="text-foreground mb-6">
        These Vendor Terms and Conditions ("Vendor Terms") constitute a legally binding agreement between you (the "Vendor") and 9jacart.ng Limited ("9jacart.ng", "we", "us", or "our"), a company registered in Lagos, Nigeria. By registering as a vendor, listing products/services, or using our platform, you agree to these Vendor Terms, which incorporate the Vendor Agreement Policy. These Terms emphasize your commitment to legitimacy and authenticity, crucial for our BNPL model's risk management, and draw from global standards like the UN Guidelines for Consumer Protection and Nigeria's Companies and Allied Matters Act (CAMA).
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        1. Definitions
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li><strong>"Platform":</strong> The 9jacart.ng website, app, and associated services.</li>
        <li><strong>"Products/Services":</strong> Goods (e.g., groceries, fashion) and services (e.g., travel) listed by Vendor.</li>
        <li><strong>"BNPL":</strong> Buy Now, Pay Later financing provided by us or partners.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        2. Vendor Representations and Warranties
      </h2>
      <p className="text-foreground mb-3">
        You represent and warrant that:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Your business is legitimate, duly registered, and compliant with all laws.</li>
        <li>All Products/Services are authentic, legal, and non-infringing.</li>
        <li>You have full authority to sell and fulfill orders.</li>
        <li>You will maintain accurate records for audits.</li>
      </ul>
      <p className="text-foreground mb-4">
        Breach of these warranties entitles us to remedies including damages and injunctions.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        3. Platform Usage
      </h2>

      <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
        License Grant
      </h3>
      <p className="text-foreground mb-4">
        We grant a non-exclusive, revocable license to use the Platform for selling, subject to compliance.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
        Prohibited Activities
      </h3>
      <p className="text-foreground mb-4">
        No spamming, data mining, or listing prohibited items (e.g., illegal substances, weapons).
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
        BNPL-Specific
      </h3>
      <p className="text-foreground mb-4">
        You authorize us to handle customer financing; you must not charge extra for BNPL users or discriminate.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        4. Fees and Payments
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>For every product sold by a vendor, 9jaCart is entitled to a commission of 3.5% of the original price of such product.</li>
        <li>There is also a flat NGN750 naira transaction fee for every customer's transaction.</li>
        <li>We act as payment agent; you grant us authority to collect and remit funds.</li>
        <li><strong>Taxes:</strong> You are responsible for all applicable taxes.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        5. Fulfillment and Customer Service
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Ship orders per our Shipping Policy; provide tracking.</li>
        <li>Handle returns/refunds per customer policies, funding any vendor-fault resolutions.</li>
        <li>Respond to inquiries/disputes within 24 hours.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        6. Intellectual Property
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>You grant us a perpetual license to use your listings/content for promotion.</li>
        <li>We own all Platform IP; you must not copy or reverse-engineer.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        7. Confidentiality and Data Protection
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Treat Platform data as confidential.</li>
        <li>Comply with data laws (e.g., NDPR in Nigeria); obtain consents for any data use.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        8. Indemnification
      </h2>
      <p className="text-foreground mb-4">
        You indemnify us against losses from your breaches, including legitimacy/authenticity issues, product defects, or BNPL-related defaults.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        9. Limitation of Liability
      </h2>
      <p className="text-foreground mb-4">
        Our liability is limited to commissions earned in the prior 12 months; no indirect damages.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        10. Termination
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>By either party with 30 days' notice; immediate for breaches.</li>
        <li><strong>Post-termination:</strong> Settle accounts within 60 days; remove listings.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        11. Governing Law and Dispute Resolution
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Governed by Nigerian law; exclusive jurisdiction in Lagos courts.</li>
        <li><strong>Disputes:</strong> Negotiation, then arbitration per Arbitration and Mediation Act 2023.</li>
      </ul>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        12. Amendments and Miscellaneous
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>We may amend with 15 days' notice; continued use accepts changes.</li>
        <li><strong>Force Majeure:</strong> Excused for uncontrollable events.</li>
        <li><strong>Entire Agreement:</strong> These Terms supersede priors.</li>
        <li><strong>Severability:</strong> Invalid provisions do not affect others.</li>
      </ul>

      <p className="text-foreground mt-8 text-sm">
        By accepting, you confirm understanding and agreement. Effective Date: Upon registration. Last Updated: February 1, 2026. Contact us via mail or our website for queries.
      </p>
    </PolicyPageLayout>
  );
}
