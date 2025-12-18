import { motion } from "framer-motion";
import FlowTransition from "./FlowTransition";

function Experience() {
  {
    /* Platform Flow Section */
  }
  return (
    <section className="platform-section relative py-20 px-4 bg-gradient-to-b from-[#0E161B] to-slate-900">
      {/* <section className="platform-section relative py-20 px-4 bg-gradient-to-b from-[#0E161B] to-slate-900"> */}
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent">
              <span className="text-[#8DEB6E]">Experience</span> the Platform
            </h2>

      

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From vendor onboarding to customer checkout - see how we're
            revolutionizing e-commerce
          </p>
        </motion.div>

        {/* Flow Transition Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <FlowTransition />
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
