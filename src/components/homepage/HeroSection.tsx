import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SparkButton from "../SparkButton";
import HeroAnimation from "./HeroAnimation";

const HeroSection = () => {
  return (
    <section
      className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-green-50"
      aria-labelledby="hero-heading"
    >
      {/* Simple background elements */}
      <div className="absolute inset-0">
        {/* Main background circle */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        {/* Accent circle */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Transform your business and{" "}

              {/* <span className="text-primary relative">
                Sell more,
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full" />
              </span> */}
              {/* <RotatingText
                texts={["Scale faster", "Go further", "Achieve more", "Win bigger"]}
                mainClassName=" px-2 bg-[#a9cdb2] text-black overflow-hidden py-0.5 justify-center rounded-lg"
                staggerFrom={"first"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              /> */}
              {/* Less stress */}

            <span className="inline-block mt-2 px-2 bg-[#a9cdb2] text-black overflow-hidden py-0.5 justify-center rounded-lg">
              Achieve more
            </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 pb-0.5 sm:pb-1 md:pb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Give your customers the freedom to Buy Now, Pay Later. Boost your
              sales, attract more shoppers, and grow with ease.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* <Button
                asChild
                size="lg"
                className="text-lg bg-[#8DEB6E] text-primary font-bold px-8 py-6 shadow-lg hover:shadow-xl hover:bg-[#8DEB6E]/80 transition-all duration-300"
              > */}
                <Link
                  to="/register"
                  className=""
                >
                  {/* Join Our Vendor Network
                  <ArrowRight className="w-5 h-5" /> */}
                  <SparkButton/>
                </Link>
              {/* </Button> */}
            </motion.div>
          </div>

          {/* Right Column - Hero Image */}
          {/* <div className="flex justify-center lg:justify-end"> */}
        <HeroAnimation/>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
