import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import EnhancedImage from "../ui/enhanced-image";
import TransformImage from "@/assets/faq.png";

const CTASection = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#E8FAF6] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 items-center">
            {/* Left Column - Image */}
            <motion.div
              className="relative h-64 lg:h-full min-h-[300px]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <EnhancedImage
                src={TransformImage}
                alt="Three merchants smiling and ready to transform their business"
                className="w-full h-full object-cover"
                // aspectRatio="auto"
                animate={false}
                fallbackContent={
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        Ready to Transform
                      </p>
                    </div>
                  </div>
                }
              />
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="p-8 lg:p-12"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to Transform Your Business?
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                Join thousands of merchants already growing their sales with
                9jacart's Buy Now, Pay Later platform. Start your journey today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[#8DEB6E] hover:bg-[#8DEB6E]/70 text-primary text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group rounded-lg"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2"
                  >
                    Sign Up
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
