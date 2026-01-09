// SellProductsPage.tsx
import Footer from "@/components/homepage/Footer";
import MainHeader from "@/components/MainHeader";
import { motion } from "framer-motion";
import {
  UserPlus,
  CheckCircle,
  Store,
  Package,
  CreditCard,
  ShoppingBag,
  Truck,
  DollarSign,
  TrendingUp,
  Shield,
  ChevronRight,
  HelpCircle,
  Users,
  BarChart3,
  Smartphone,
  Upload,
  Target,
  Zap,
  BadgeCheck,
  Award,
  Star,
  Clock,
  Headphones,
} from "lucide-react";
import { useState } from "react";

const SellProductsPage = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  // Steps data
  const steps = [
    {
      id: 1,
      title: "Create Seller Account",
      icon: UserPlus,
      description: "Sign up using email or phone number",
      details: [
        "Visit www.9jacart.ng",
        "Click 'Sell on 9jacart' or 'Become a Seller'",
        "Sign up using your email address or phone number",
        "Verify your account via email or OTP",
      ],
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Complete Verification",
      icon: BadgeCheck,
      description: "Verify your business details",
      details: [
        "Provide business details (name, address, contact)",
        "Upload valid identification or business registration",
        "Submit bank account details for payouts",
        "Gain full access to seller dashboard",
      ],
      color: "from-green-500/10 to-green-600/5",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "Set Up Your Store",
      icon: Store,
      description: "Customize your store profile",
      details: [
        "Upload logo and banner",
        "Add store description",
        "Set pickup or warehouse location",
        "Define delivery options and service areas",
      ],
      color: "from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      title: "List Your Products",
      icon: Package,
      description: "Add products to your store",
      details: [
        "Upload clear product images",
        "Add accurate titles and descriptions",
        "Set competitive pricing",
        "Indicate stock quantity and variations",
        "Select appropriate category",
      ],
      color: "from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-600",
    },
    {
      id: 5,
      title: "Enable BNPL Payments",
      icon: CreditCard,
      description: "Offer flexible payment options",
      details: [
        "Choose BNPL availability for products",
        "Approved BNPL = instant customer purchases",
        "Receive payment upfront from us",
        "Improve your cash flow",
      ],
      color: "from-cyan-500/10 to-cyan-600/5",
      iconColor: "text-cyan-600",
    },
    {
      id: 6,
      title: "Receive Orders",
      icon: ShoppingBag,
      description: "Start getting sales",
      details: [
        "Get instant notifications for new orders",
        "Confirm and process orders from dashboard",
        "Prepare items for pickup or delivery",
        "Manage order queue efficiently",
      ],
      color: "from-pink-500/10 to-pink-600/5",
      iconColor: "text-pink-600",
    },
    {
      id: 7,
      title: "Delivery & Fulfillment",
      icon: Truck,
      description: "Get products to customers",
      details: [
        "Use integrated logistics partners",
        "Or use your own delivery service",
        "Update order status for transparency",
        "Ensure timely and quality delivery",
      ],
      color: "from-indigo-500/10 to-indigo-600/5",
      iconColor: "text-indigo-600",
    },
    {
      id: 8,
      title: "Get Paid",
      icon: DollarSign,
      description: "Secure and fast payouts",
      details: [
        "Payments securely processed",
        "Funds settled to your bank account",
        "BNPL orders paid upfront",
        "Clear payout schedule",
      ],
      color: "from-emerald-500/10 to-emerald-600/5",
      iconColor: "text-emerald-600",
    },
    {
      id: 9,
      title: "Grow Your Business",
      icon: TrendingUp,
      description: "Build trust and expand",
      details: [
        "Maintain high product quality",
        "Deliver on time consistently",
        "Respond to customer inquiries",
        "Earn positive ratings and reviews",
        "Use analytics to optimize sales",
      ],
      color: "from-violet-500/10 to-violet-600/5",
      iconColor: "text-violet-600",
    },
  ];

  // Benefits data
  const benefits = [
    {
      title: "Growing Customer Base",
      description: "Access to thousands of active shoppers across Africa",
      icon: Users,
      color: "bg-blue-500/10",
    },
    {
      title: "Higher Conversion",
      description: "BNPL increases customer purchasing power by 40%",
      icon: CreditCard,
      color: "bg-green-500/10",
    },
    {
      title: "Secure Transactions",
      description: "Guaranteed payments and fraud protection",
      icon: Shield,
      color: "bg-purple-500/10",
    },
    {
      title: "Powerful Analytics",
      description: "Real-time insights to optimize your sales strategy",
      icon: BarChart3,
      color: "bg-orange-500/10",
    },
    {
      title: "Mobile Management",
      description: "Manage your store on-the-go with our mobile app",
      icon: Smartphone,
      color: "bg-cyan-500/10",
    },
    {
      title: "Fast Onboarding",
      description: "Start selling in less than 30 minutes",
      icon: Zap,
      color: "bg-pink-500/10",
    },
  ];

  // Stats data
  const stats = [
    { value: "40%+", label: "Higher Conversion with BNPL", icon: TrendingUp },
    { value: "24-48hrs", label: "Average Payout Time", icon: Clock },
    { value: "99.5%", label: "Secure Transaction Rate", icon: Shield },
    { value: "4.8★", label: "Seller Satisfaction", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.span
                variants={scaleIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6"
              >
                <Award className="w-4 h-4" />
                For Sellers & MSMEs
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
              >
                Turn Your Products Into
                <span className="block text-primary"> Profitable Sales</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Join thousands of successful sellers on 9jacart.ng <br/> Africa's
                fastest growing marketplace. Simple setup, secure payments, and
                tools to scale your business.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  Start Selling Free
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Watch Demo Video
                </motion.button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works - Steps */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              >
                Start Selling in{" "}
                <span className="text-primary">9 Simple Steps</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                From signup to your first sale — we've streamlined everything
                for you
              </motion.p>
            </motion.div>

            {/* Desktop Steps Layout */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2" />

                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={
                      index % 2 === 0 ? slideInFromLeft : slideInFromRight
                    }
                    className={`flex items-center mb-12 ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Step Card */}
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() =>
                        setActiveStep(activeStep === step.id ? null : step.id)
                      }
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 cursor-pointer`}
                      >
                        <div
                          className={`inline-flex p-3 rounded-xl ${
                            step.color.split(" ")[0]
                          } mb-4`}
                        >
                          <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-left"
                          >
                            <ul className="space-y-2">
                              {step.details.map((detail, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Step Number & Circle */}
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-16 h-16 rounded-full border-4 border-background flex items-center justify-center font-bold text-xl ${
                          activeStep === step.id
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-card text-foreground"
                        }`}
                      >
                        {step.id}
                      </motion.div>
                    </div>

                    {/* Empty Space */}
                    <div className="w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Steps Layout */}
            <div className="lg:hidden space-y-6">
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  onClick={() =>
                    setActiveStep(activeStep === step.id ? null : step.id)
                  }
                  className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${step.color.split(" ")[0]}`}
                    >
                      <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            activeStep === step.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {step.id}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      {activeStep === step.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              >
                Why <span className="text-primary">Thousands of Sellers</span>{" "}
                Choose 9jacart
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Everything you need to grow your business, all in one place
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -8 }}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-xl transition-all duration-300 group"
                >
                  <div
                    className={`p-3 rounded-lg ${benefit.color} inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* BNPL Advantage for Sellers */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={slideInFromLeft}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-primary">
                    Seller Advantage
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Boost Sales with
                  <span className="text-primary"> Buy Now, Pay Later</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">
                        Get Paid Upfront
                      </h4>
                      <p className="text-muted-foreground">
                        We pay you immediately for BNPL orders, improving your
                        cash flow
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">
                        Increase Conversion
                      </h4>
                      <p className="text-muted-foreground">
                        Customers are 40% more likely to complete purchases with
                        flexible payments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl">
                    <Shield className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">
                        Zero Risk
                      </h4>
                      <p className="text-muted-foreground">
                        We handle all payment risks and customer credit checks
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slideInFromRight} className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl p-8 border border-border">
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-xl">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">
                            BNPL Impact
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                          See the Difference
                        </h3>
                        <p className="text-muted-foreground">
                          Traditional vs BNPL-enabled sales
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-foreground">
                              Without BNPL
                            </span>
                            <span className="text-muted-foreground">
                              60% conversion
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-[60%] bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-foreground">
                              With BNPL Enabled
                            </span>
                            <span className="text-primary font-semibold">
                              95% conversion
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-[95%] bg-gradient-to-r from-primary to-primary/70 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              +35%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Average sales increase
                            </div>
                          </div>
                          <TrendingUp className="w-12 h-12 text-primary/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="container mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={scaleIn}
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 rounded-3xl p-12 border border-border"
            >
              <motion.span
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full font-medium mb-6"
              >
                <CheckCircle className="w-4 h-4" />
                No Listing Fees • No Monthly Charges
              </motion.span>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
              >
                Ready to Grow Your Business?
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Join Africa's fastest-growing marketplace. Start selling in
                minutes and reach millions of customers.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Upload className="w-5 h-5" />
                  Start Selling Free
                </motion.button>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Seller FAQ
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Headphones className="w-5 h-5" />
                      Contact Support
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="mt-8 text-sm text-muted-foreground"
              >
                Pay only when you make a sale. No hidden fees, no setup costs.
              </motion.p>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h3
                variants={fadeInUp}
                className="text-2xl font-bold mb-4 text-foreground"
              >
                Common Questions from Sellers
              </motion.h3>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  q: "How long does verification take?",
                  a: "Most seller accounts are verified within 24 hours.",
                },
                {
                  q: "When do I get paid?",
                  a: "Payments are settled daily for regular orders and upfront for BNPL orders.",
                },
                {
                  q: "Is there a fee to sell on 9jacart?",
                  a: "No listing fees. We only charge a small commission when you make a sale.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SellProductsPage;
