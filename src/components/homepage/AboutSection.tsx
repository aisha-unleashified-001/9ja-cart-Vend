import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Clock,
  Users,
  Package,
  BarChart3,
  BadgeCheck,
  Banknote,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
   const [isHovered, setIsHovered] = useState(false);
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
              <BadgeCheck className="w-4 h-4 mr-2" />
              SELLER PLATFORM
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Designed for <span className="text-primary">Growing</span> Your
              Business
            </h2>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A powerful e-commerce platform built specifically for sellers who
            want to
            <span className="font-semibold text-foreground">
              {" "}
              scale efficiently{" "}
            </span>
            and maximize their online presence.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Seller Benefits */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Everything You Need to Succeed
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Guaranteed Revenue
                    </h4>
                    <p className="text-muted-foreground">
                      Receive full payments upfront while customers pay in
                      installments. Eliminate payment delays and cash flow
                      issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Expanded Customer Base
                    </h4>
                    <p className="text-muted-foreground">
                      Tap into customers who prefer flexible payment options.
                      Increase your market reach without additional marketing
                      costs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Streamlined Operations
                    </h4>
                    <p className="text-muted-foreground">
                      Comprehensive dashboard for inventory, orders, and
                      analytics. Manage your entire business from one intuitive
                      interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Testimonial */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div>
                  <p className="text-foreground italic mb-2">
                    "Our sales increased by 15% in the first week. The BNPL
                    option brought in customers we couldn't reach before."
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Sarah K., Fashion Retailer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Selling on 9jacart for 8 months
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Platform Features */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Platform Stats Card */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Platform Performance
                </h3>
                <p className="text-muted-foreground">
                  Real results for sellers like you
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    99.9%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Platform
                  </div>
                  {/* <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    +12% this quarter
                  </div> */}
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Secure Payments
                  </div>
                  {/* <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Zero payment defaults
                  </div> */}
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    Multi-Category
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Product Listings
                  </div>
                  {/* <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Growing daily
                  </div> */}
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    10 min
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Support Response
                  </div>
                  {/* <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Priority seller support
                  </div> */}
                </div>
              </div>

              {/* <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground">
                      Platform Uptime
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    99.9%
                  </span>
                </div>
              </div> */}
            </div>
          </motion.div>
        </div>

        {/* Quick Start CTA */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 mt-5 text-center">
          <h4 className="font-bold text-lg text-foreground mb-2">
            Ready to Start Selling?
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Complete registration in under 10 minutes and list your first
            product.
          </p>
         <Link to={"/register"}>
      <motion.button
        className="group relative cursor-pointer p-3 bg-[#8DEB6E] text-primary font-semibold rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Scale and depth on hover
        whileHover={{ 
          scale: 1.05,
          y: -2,
          transition: { duration: 0.3 }
        }}
        // Click feedback
        whileTap={{ 
          scale: 0.98,
          y: 1,
          transition: { duration: 0.1 }
        }}
      >
        {/* Shimmer/glow background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ 
            duration: 0.8,
            ease: "easeInOut"
          }}
        />
        
        {/* Pulsing border glow */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-white/0"
          animate={{
            borderColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        
        {/* Content with staggered animations */}
        <motion.span className="relative z-10 flex items-center justify-center gap-2">
          <motion.span
            animate={{ x: 0 }}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.3 }}
          >
            Join Sellers
          </motion.span>
          
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0.8 : 1 }}
          >
            Now
          </motion.span>
          
          <motion.span
            initial={{ x: 0, opacity: 0.8 }}
            animate={{ 
              x: isHovered ? 8 : 0,
              opacity: 1
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 500
            }}
          >
            →
          </motion.span>
        </motion.span>
      </motion.button>
    </Link>
        </div>
        {/* Bottom CTA Section */}
        {/* <motion.div
          className="mt-16 lg:mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-card border border-border rounded-2xl px-8 py-8 sm:py-6 shadow-sm">
            <div className="text-left">
              <h4 className="font-bold text-xl text-foreground mb-1">
                No Monthly Fees
              </h4>
              <p className="text-muted-foreground">
                Pay only when you make a sale
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 bg-[#8DEB6E] text-primary font-semibold rounded-lg hover:bg-[#8DEB6E]/90 transition-colors duration-200 whitespace-nowrap">
                Start Selling Free
              </button>
              <button className="px-6 py-3 border border-border font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default AboutSection;
