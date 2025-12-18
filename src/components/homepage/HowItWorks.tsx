import { motion } from "framer-motion";
import { Users, Store, Truck, TrendingUp } from "lucide-react";
// import EnhancedImage from "../ui/enhanced-image";
// import ShopImage from "@/assets/how-it-works/shop.png";
// import PaidImage from "@/assets/how-it-works/paid.png";
// import WinImage from "@/assets/how-it-works/win.png";
import { people } from "@/assets/people";



///   TURN THIS INTO THE NICE LOOKING EXOERIENCE PAGE INSTEAD OF THE GRID ONE
//
//
//
//
//

function HowItWorks() {
  const features = [
    {
      title: "For Customers",
      description:
        "Shop now and pay later with flexible installment options that fit your budget.",
      icon: Users,
      bg: "#A8E8DC",
    },
    {
      title: "For Vendors",
      description:
        "Get guaranteed upfront payments while customers pay in installments.",
      icon: Store,
      bg: "#D5ECB4",
    },
    {
      title: "Integrated Logistics",
      description:
        "Comprehensive delivery network ensuring your products reach customers efficiently.",
      icon: Truck,
      bg: "#E3EBE5",
    },
    {
      title: "Marketing Support",
      description:
        "Boost your sales with our marketing tools and growing customer base.",
      icon: TrendingUp,
      bg: "#BFD7CC",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };
  return (
    <section className="py-16 md:py-20 lg:py-28 bg-[#EAF7ED] overflow-hidden relative">
      <div className="mb-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            How It Works
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our BNPL platform creates value for both vendors and
            customers
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className="flex items-center whitespace-nowrap"
            animate={{
              x: [0, -5400],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50,
                ease: "linear",
              },
            }}
          >
            {people.map((person) => (
              <div
                key={person.id}
                className="flex-shrink-0 w-64 md:w-[500px] h-64 mx-4 rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={person.image}
                  alt={`Product ${person.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {people.map((person) => (
              <div
                key={person.id}
                className="flex-shrink-0 w-64 md:w-[500px] h-64 mx-4 rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={person.image}
                  alt={`Product ${person.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {people.map((person) => (
              <div
                key={person.id}
                className="flex-shrink-0 w-64 md:w-[500px] h-64 mx-4 rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={person.image}
                  alt={`Product ${person.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                // className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20"
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 hover:border-primary/20"
                style={{ backgroundColor: feature.bg }}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
