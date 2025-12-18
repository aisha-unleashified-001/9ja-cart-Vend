import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import sculptureImage from "@/assets/sculpture.png";
import { Button } from "../ui/button";

const FinalCTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with sculpture image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${sculptureImage})`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* White content card */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-border/20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Ready to Start Selling?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
                  Join thousands of successful sellers on our platform. Expand your reach and grow your business today!
                </p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link to="/vendor-form">
                    <Button className="text-primary bg-[#8DEB6E] hover:bg-[#8DEB6E]/80">
                      <span>Take Profit</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute top-1/4 right-8 w-12 h-12 bg-accent/20 rounded-full blur-lg" />
      <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-secondary/15 rounded-full blur-md" />
    </section>
  );
};

export default FinalCTASection;
