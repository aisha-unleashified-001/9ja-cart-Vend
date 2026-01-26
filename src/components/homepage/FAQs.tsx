import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  CreditCard,
  Truck,
  Store,
  Package,
  Shield,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: "getting-started",
    category: "Getting Started",
    icon: Sparkles,
    items: [
      {
        id: "gs-1",
        question: "What is 9jacart and how does it work for sellers?",
        answer:
          "9jacart is Nigeria's premier Buy Now, Pay Later (BNPL) e-commerce platform specifically designed to help sellers grow their business. We handle customer payments in installments while ensuring you receive full, guaranteed payments upfront within 24 hours of order confirmation.",
      },
      {
        id: "gs-2",
        question: "How do I become a verified seller on 9jacart?",
        answer:
          "Complete our streamlined vendor application online, submit required business documentation, and our team will verify your account within 24-48 hours. Once approved, you'll receive access to your seller dashboard to start listing products immediately.",
      },
      {
        id: "gs-3",
        question: "What are the requirements to start selling?",
        answer:
          "You need a registered business in Nigeria, valid CAC documents, bank account details, product catalogue, and quality product images. No prior e-commerce experience required - we provide full onboarding support.",
      },
    ],
  },
  {
    id: "payments-payouts",
    category: "Payments & Payouts",
    icon: CreditCard,
    items: [
      {
        id: "pp-1",
        question: "When and how do I receive my payments?",
        answer:
          "You receive 100% guaranteed payments upfront within 24 hours of order confirmation. Funds are transferred directly to your registered bank account every Tuesday and Friday, or daily for Top-rated sellers.",
      },
      {
        id: "pp-2",
        question: "What are the selling fees and commission structure?",
        answer:
          "We charge a competitive commission ranging from 5-15% depending on product category, which covers payment processing, platform maintenance, marketing support, and customer service. No hidden fees or monthly subscriptions.",
      },
      {
        id: "pp-3",
        question: "What happens if a customer defaults on BNPL payments?",
        answer:
          "You are completely protected. Since you receive upfront payments, any payment collection risks are handled by 9jacart. We manage all customer credit risks and collections, ensuring you never face bad debts.",
      },
      {
        id: "pp-4",
        question: "Are there any setup or monthly fees?",
        answer:
          "Absolutely not. There are zero setup fees, no monthly subscriptions, and no hidden charges. You only pay when you make a sale, making it risk-free to start selling.",
      },
    ],
  },
  {
    id: "logistics-fulfillment",
    category: "Logistics & Fulfillment",
    icon: Truck,
    items: [
      {
        id: "lf-1",
        question: "How does order fulfillment and delivery work?",
        answer:
          "Choose between self-fulfillment or using our integrated logistics network. Our partner couriers offer nationwide coverage with competitive rates and real-time tracking. We handle customer delivery coordination and returns management.",
      },
      {
        id: "lf-2",
        question: "What are the shipping rates and who pays for delivery?",
        answer:
          "Customers typically pay shipping fees, but you can offer free shipping promotions. Our logistics dashboard provides real-time rate calculations across all major carriers. Volume sellers enjoy discounted shipping rates.",
      },
      {
        id: "lf-3",
        question: "How do returns and refunds work?",
        answer:
          "We manage the entire returns process including pickup coordination, quality checks, and customer refunds. For BNPL orders, refunds are processed through our system without affecting your already-received payments.",
      },
    ],
  },
  {
    id: "sales-growth",
    category: "Sales & Growth",
    icon: Store,
    items: [
      {
        id: "sg-1",
        question: "How will 9jacart help me increase my sales?",
        answer:
          "Our BNPL model increases customer purchase power by 35%, leading to higher average order values. You'll also gain access to our 5M+ customer base, featured placements, and marketing campaigns designed to drive traffic to your store.",
      },
      {
        id: "sg-2",
        question: "Do I get access to sales analytics and insights?",
        answer:
          "Yes, our comprehensive seller dashboard provides real-time analytics on sales performance, customer behavior, inventory trends, and market insights to help you make data-driven business decisions.",
      },
      {
        id: "sg-3",
        question: "Can I run promotions and discounts?",
        answer:
          "Absolutely! Our platform supports various promotional tools including flash sales, discount coupons, bundle offers, and seasonal campaigns. We also feature promotional events on our homepage and through our marketing channels.",
      },
    ],
  },
  {
    id: "support-security",
    category: "Support & Security",
    icon: Shield,
    items: [
      {
        id: "ss-1",
        question: "What kind of seller support do you provide?",
        answer:
          "24/7 dedicated seller support via chat, phone, and email. You'll also get a dedicated account manager for strategic guidance, regular business reviews, and growth consultation to optimize your performance.",
      },
      {
        id: "ss-2",
        question: "How secure is my business and customer data?",
        answer:
          "We employ bank-level encryption, secure payment gateways, and comply with global data protection regulations. Your business information is protected with multi-layer security protocols and regular security audits.",
      },
      {
        id: "ss-3",
        question: "Can I integrate with my existing inventory system?",
        answer:
          "Yes, we offer API integration with popular inventory management systems, accounting software, and ERP solutions. Our technical team provides integration support to ensure seamless operations.",
      },
    ],
  },
];

export default function FAQs() {
  const [openCategories, setOpenCategories] =
    useState<string>("getting-started");
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches;

  const handleCategoryChange = useCallback(
    (value: string) => {
      setOpenCategories(value);

      // On mobile, ensure the opened accordion starts from the top in view.
      if (!isMobile || !value) return;

      window.setTimeout(() => {
        const el = document.getElementById(`faq-${value}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [isMobile]
  );

  return (
    <section
      className="py-20  bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
      id="faq"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
            transition={{ duration: isMobile ? 0.3 : 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              SELLER FAQS
            </Badge>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
            transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : 0.1 }}
          >
            Everything You Need to <span className="text-primary">Know</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
            transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : 0.2 }}
          >
            Get answers to common questions about selling, payments, logistics,
            and growing your business on 9jacart.
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - FAQ Categories - Hidden on mobile */}
          <motion.div
            className="hidden lg:block lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="sticky top-24 border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  FAQ Categories
                </CardTitle>
                <CardDescription>Browse questions by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {faqs.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={
                          openCategories.includes(category.id)
                            ? "default"
                            : "ghost"
                        }
                        className="w-full justify-start h-auto py-3 px-4 mb-2"
                        onClick={() =>
                          setOpenCategories(
                            openCategories === category.id ? "" : category.id
                          )
                        }
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{category.category}</div>
                          <div className="text-xs text-muted-background mt-1">
                            {category.items.length} questions
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openCategories.includes(category.id)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - FAQ Accordion - Full width on mobile */}
          <motion.div
            className="lg:col-span-2 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
            transition={{ duration: isMobile ? 0.25 : 0.6, delay: isMobile ? 0 : 0.2 }}
          >
            <Accordion
              type="single"
              value={openCategories}
              onValueChange={handleCategoryChange}
              className="space-y-4"
              collapsible
            >
              {faqs.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    id={`faq-${category.id}`}
                    className="scroll-mt-24 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="p-6 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50 data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/5 data-[state=open]:to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">
                            {category.category}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {category.items.length} questions answered
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0">
                      <div className="space-y-4 pt-4">
                        {category.items.map((item) => (
                          <Card
                            key={item.id}
                            className="border-gray-200 dark:border-gray-800 shadow-none"
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base font-semibold">
                                {item.question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.answer}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* Bottom CTA */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
              transition={{ duration: isMobile ? 0.25 : 0.6, delay: isMobile ? 0 : 0.4 }}
            >
              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6">
                    <div className="text-center lg:text-left">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Still have questions?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our seller success team is ready to help you get
                        started.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <Link to={"/contact"}>
                        <Button size="lg" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Contact Us
                        </Button>
                      </Link>
                      <Button size="lg" variant="outline" className="gap-2">
                        <Package className="w-4 h-4" />
                        Download Seller Guide
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Support Available
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        15min
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Response Time
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Resolution Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        4.8/5
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Satisfaction Score
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
