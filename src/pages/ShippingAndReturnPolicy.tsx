import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export default function ShippingAndReturnPolicy() {
  return (
    <PolicyPageLayout title="Shipping and return policy">
      <p className="text-foreground mb-6">
        At 9jacart.ng, we are committed to providing a seamless, reliable, and customer-centric shipping and return experience that aligns with global best practices, including those outlined by the International Chamber of Commerce (ICC) and the Federal Competition and Consumer Protection Commission (FCCPC) in Nigeria. Our policy ensures transparency, efficiency, and fairness, while integrating seamlessly with our Buy Now, Pay Later (BNPL) services to minimize financial strain on customers. This policy applies to all purchases made through our platform, including those by diaspora users, and is designed to exceed industry standards by offering extended timelines, minimal fees, and proactive support.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        Shipping Guidelines
      </h2>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Delivery Options and Timelines
      </h3>
      <p className="text-foreground mb-4">
        We partner with a reputable logistics provider - United Parcel Services (UPS) - and local curriers to ensure fast and reliable delivery across Nigeria and to select international destinations for diaspora customers. Delivery timelines are:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li><strong>Within Lagos:</strong> 1–3 business days from the date of receipt of product from vendor.</li>
        <li><strong>Other major cities</strong> (e.g., Abuja, Port Harcourt): 2–7 business days for non-perishable products and 48 hours for Perishable goods from the date of delivery of goods by vendor.</li>
        <li><strong>Remote areas in Nigeria:</strong> 7-14 business days from the date of delivery of goods by vendor.</li>
        <li><strong>Diaspora shipments</strong> (e.g., to the UK, US, or Canada): 7–21 business days, subject to customs clearance.</li>
      </ul>
      <p className="text-foreground mb-4">
        Estimated delivery dates are provided at checkout and via email/SMS notifications. Real-time tracking is available through our user dashboard and app.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Order Processing
      </h3>
      <p className="text-foreground mb-4">
        Orders are processed within 24 hours subject to vendor's confirmation. For BNPL purchases, shipping commences only after credit approval, which typically occurs instantly or within 1 hour. If delays occur due to stock verification or high demand, customers are notified immediately, and alternative options (e.g., similar products) are offered without charge.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Shipping Costs and Customs
      </h3>
      <p className="text-foreground mb-4">
        All shipping fees are clearly displayed at checkout. For diaspora orders, customers are responsible for any applicable customs duties, taxes, or import fees, which are estimated upfront. We provide documentation assistance to facilitate smooth customs processing.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Damaged or Incorrect Items
      </h3>
      <p className="text-foreground mb-4">
        Upon delivery, customers must inspect items immediately. If an item arrives damaged, defective, or incorrect, notify us within 48 hours via our app, email or telephone line.
      </p>

      <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">
        Return Guidelines
      </h2>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Return Eligibility
      </h3>
      <p className="text-foreground mb-4">
        Returns are accepted for most items within 30 days of delivery (exceeding the standard 14–15 days in many global policies), provided the item is unused, in original packaging, and with all tags/accessories intact. Exceptions include:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Perishable goods (e.g., groceries), personalized items, intimate apparel, or digital downloads, which are non-returnable unless defective.</li>
        <li>Services (e.g., laundry, travel bookings, Uber/Bolt rides) are returnable only if unfulfilled or defective, subject to provider terms.</li>
      </ul>
      <p className="text-foreground mb-4">
        Eligible returns must be initiated through the user dashboard for a Return Merchandise Authorization (RMA) number.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Return Process
      </h3>
      <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
        <li>Log into your account and select "Return Item" within the 30-day window.</li>
        <li>Provide reasons and photos if applicable (e.g., for defects).</li>
        <li>Once received and inspected (typically within 14 business days), we process the return.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Integration with BNPL
      </h3>
      <p className="text-foreground mb-4">
        For BNPL purchases, returns trigger an automatic adjustment to your payment plan. Full returns result in a complete reversal of the loan balance, with any paid installments refunded to your original payment method or credited toward future purchases. Partial returns adjust the outstanding balance proportionally. Payments are paused during the return process to avoid undue charges.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Refunds for Returns
      </h3>
      <p className="text-foreground mb-4">
        Refunds are issued within 7 business days of vendor's confirmation via the original payment method. No restocking fees apply unless the return is due to customer error (e.g., change of mind), in which case a 15% fee may be deducted.
      </p>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-6">
        Warranties and Guarantees
      </h3>
      <p className="text-foreground mb-4">
        All vendors are verified and legitimate. Our approved vendors have undergone thorough profiling and scrutiny to ascertain the validity and legitimacy of their services.
      </p>

      <p className="text-foreground mt-6">
        We continuously monitor and improve our shipping and return processes through customer feedback, aiming for a 99% on-time delivery rate and resolution satisfaction. Violations of this policy (e.g., fraudulent returns) may result in account suspension.
      </p>
    </PolicyPageLayout>
  );
}
