import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Shirt,
  Home,
  Sparkles,
  Smartphone,
  // ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import FloatingParticles from "../options/FloatingParticles";
import GridPattern from "../options/GridPatterns";
import FloatingBubbles from "../options/FloatingBubbles";

const productCategories = [
  {
    id: "health",
    name: "Health",
    description: "Supplements • Wellness • Fitness",
    icon: Heart,
    color: "from-green-500/20 to-green-600/20",
  },
  {
    id: "groceries",
    name: "Groceries",
    description: "Food • Beverages • Essentials",
    icon: ShoppingCart,
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Clothing • Shoes • Accessories",
    icon: Shirt,
    color: "from-pink-500/20 to-pink-600/20",
  },
  {
    id: "home",
    name: "Home",
    description: "Furniture • Decor • Appliances",
    icon: Home,
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    id: "beauty",
    name: "Beauty",
    description: "Skincare • Haircare • Baby Care",
    icon: Sparkles,
    color: "from-cyan-500/20 to-cyan-600/20",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Phones • Laptops • Gadgets",
    icon: Smartphone,
    color: "from-purple-500/20 to-purple-600/20",
  },
];

const backgroundComponents = [GridPattern, FloatingParticles,FloatingBubbles];

const RandomBackground =
    backgroundComponents[Math.floor(Math.random() * backgroundComponents.length)];

const ProductGallerySection = () => {
  return (
    <section className="relative py-16 bg-background overflow-hidden">
      {/* Background Animation */}
      
      <RandomBackground />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
        
        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Sell Across Multiple Categories
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Expand your reach by listing products in our most popular categories
          </motion.p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {productCategories.map((category, index) => {
            const IconComponent = category.icon;

            return (
              <motion.div
                key={category.id}
                className="group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 hover:bg-card transition-colors duration-200 border border-border h-full flex flex-col items-center text-center shadow-sm hover:shadow-md">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-medium text-foreground mb-1 text-sm">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 flex-1">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            Don't see your category?{" "}
            <Link
              to={"/contact"}
              className="text-primary hover:text-primary/80 font-medium cursor-pointer transition-colors"
            >
              Contact us →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGallerySection;
