import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Eye, 
  Truck, 
  Store,
  Zap,
  ArrowUpRight,
  CheckCircle
} from "lucide-react";

const benefits = [
  {
    id: "increased-sales",
    title: "Higher Average Order Value",
    description: "BNPL customers spend 35% more per transaction. Increase revenue while offering payment flexibility.",
    icon: TrendingUp,
    stat: "35%",
    statLabel: "Higher AOV",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    id: "broader-reach",
    title: "Expanded Market Access",
    description: "Tap into Nigeria's growing BNPL market - over 5 million active users who prefer flexible payments.",
    icon: Users,
    stat: "5M+",
    statLabel: "Active BNPL Users",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    id: "guaranteed-payouts",
    title: "Zero Payment Risk",
    description: "Receive 100% payment upfront within 24 hours. We absorb all credit risk from customer installments.",
    icon: Shield,
    stat: "100%",
    statLabel: "Risk-Free",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    id: "brand-visibility",
    title: "Featured Vendor Exposure",
    description: "Get prioritized visibility in search results, category pages, and our promotional campaigns.",
    icon: Eye,
    stat: "3x",
    statLabel: "More Visibility",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    id: "logistics-support",
    title: "Fulfillment Network",
    description: "Access nationwide delivery through our integrated logistics partners at competitive rates.",
    icon: Truck,
    stat: "98%",
    statLabel: "Delivery Success",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    id: "vendor-support",
    title: "Dedicated Account Manager",
    description: "Personal onboarding and ongoing support from e-commerce experts to optimize your performance.",
    icon: Store,
    stat: "< 15min",
    statLabel: "Response Time",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
];

const BenefitsSection = () => {
  return (
    <section
      className="py-20 bg-[#EAF7ED] dark:from-gray-900 dark:to-gray-950"
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6"
          >
            <Zap className="w-4 h-4" />
            SELLER ADVANTAGES
          </motion.div>

          <motion.h2
            id="benefits-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built for <span className="text-primary">Sellers Who Scale</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to grow your online business, backed by data-driven results and dedicated support.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;

            return (
              <motion.div
                key={benefit.id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`h-full ${benefit.bgColor} rounded-2xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-gray-200/50 dark:group-hover:shadow-gray-900/50 group-hover:-translate-y-1`}>
                  
                  {/* Stat Badge */}
                  <div className="absolute top-6 right-6">
                    {/* <div className={`text-white px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${benefit.color}`}>
                      {benefit.stat}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {benefit.statLabel}
                    </div> */}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-16">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Key Feature List */}
                  <div className="space-y-2 mt-8">
                    {benefit.id === "increased-sales" && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Higher conversion rates</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Repeat customer increase</span>
                        </div>
                      </>
                    )}
                    {benefit.id === "broader-reach" && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Younger demographic access</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Urban & rural coverage</span>
                        </div>
                      </>
                    )}
                    {benefit.id === "guaranteed-payouts" && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Next-day settlements</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>No chargebacks</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 lg:mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 rounded-2xl p-8 lg:p-10 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to accelerate your growth?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Join sellers who average 68% higher sales in their first quarter.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-[#8DEB6E] text-primary font-semibold rounded-lg hover:bg-[#8DEB6E]/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2">
                  Start Selling Now
                  {/* <ArrowUpRight className="w-4 h-4" /> */}
                </button>
                {/* <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  View Seller Dashboard
                </button> */}
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Early Access</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Seller Onboarding</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₦0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Listing Fees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Flexible</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Commision Model</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Launch-Ready</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Seller Tools</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;