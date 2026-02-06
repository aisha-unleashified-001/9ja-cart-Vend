import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export default function RefundPolicy() {
  return (
    <PolicyPageLayout title="Refund Policy">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Cancellation & Refund Policy
      </h2>
      <p className="text-foreground mb-6">
        9jacart.ng's Cancellation and Refund Policy is crafted to embody global best practices, drawing from frameworks like the EU Consumer Rights Directive and Nigeria's FCCPC guidelines, ensuring maximum flexibility, transparency, and protection for customers. This policy integrates BNPL features to allow cancellations without financial penalties where possible, promoting trust and accessibility for all users, including those in the diaspora.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Cancellation Guidelines
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Pre-Shipping Cancellations
      </h4>
      <p className="text-foreground mb-4">
        Orders can be canceled free of charge at any time before shipping (within 30 minutes of placement). For BNPL orders, this results in immediate loan cancellation with no impact on your credit profile.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Post-Shipping Cancellations
      </h4>
      <p className="text-foreground mb-4">
        Cancellation of orders of non-perishable goods are subject to the policy of the vendor. If an order has shipped but not yet delivered, cancellations are subject to the policy of the vendor provided the goods are non-perishable. Once delivered, cancellations transition to our Return Policy (see Shipping and Return Policy).
      </p>
      <p className="text-foreground mb-4">
        <strong>NOTE:</strong> Perishable goods are non-refundable.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Service Cancellations
      </h4>
      <p className="text-foreground mb-3">
        For services (e.g., travel, laundry, ride-hailing), cancellations follow provider-specific windows:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li><strong>Travel & Tours:</strong> Cancellations are subject to the policy of the service provider.</li>
        <li><strong>Ride-Hailing (Uber/Bolt):</strong> Refund upon cancellation is subject to the policy of the service provider.</li>
        <li><strong>Laundry:</strong> Cancellations are free for up to 2 hours after booking. No refund during/post execution of services. Cancellations are subject to the policy of the service provider.</li>
      </ul>
      <p className="text-foreground mb-4">
        All cancellations are initiated via the dashboard, with instant confirmations.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Automatic Cancellations
      </h4>
      <p className="text-foreground mb-4">
        We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraud, with full refunds and alternative offers provided where necessary.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">
        Refund Guidelines
      </h3>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Refund Eligibility
      </h4>
      <p className="text-foreground mb-4">
        Refunds are available for cancellations, returns, overpayments, or defective/unfulfilled services. Full refunds include the purchase price, shipping fees (if applicable), and any transaction fees paid.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Refund Process
      </h4>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Initiate via dashboard or support channels.</li>
        <li>Processing time: 7 business days for bank transfers.</li>
        <li>For BNPL: Refunds apply first to outstanding installments, reducing or eliminating future payments. Overpaid amounts are refunded to your linked account.</li>
        <li>Partial refunds (e.g., for bundled orders) are calculated proportionally.</li>
      </ul>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Refund Methods
      </h4>
      <p className="text-foreground mb-4">
        Refunds are issued to the original payment method (PayStack). Refunds are issued by the vendors or service provider.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Timelines and Exceptions
      </h4>
      <p className="text-foreground mb-4">
        Refunds for defective items are prioritized within 48 hours. No refunds for used/non-returnable items unless faulty. In cases of force majeure (e.g., natural disasters), refunds may be delayed but communicated promptly.
      </p>

      <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
        Dispute-Related Refunds
      </h4>
      <p className="text-foreground mb-4">
        If a dispute (see Dispute Resolution Policy) results in a favorable outcome, refunds are expedited with potential compensation for inconvenience (e.g., 10% bonus credit).
      </p>

      <p className="text-foreground mt-6">
        We track refund satisfaction and aim for 100% resolution within stipulated timelines. Abuse of this policy may lead to restrictions.
      </p>
    </PolicyPageLayout>
  );
}
