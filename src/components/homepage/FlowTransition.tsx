

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all transition images
import vendorSignIn from '@/assets/forTransition/1vendorSignIn.jpeg';
import vendorDashboard from '@/assets/forTransition/2vendorDashboard.jpeg';
import vendorProductsPage from '@/assets/forTransition/3vendorProductsPage.jpeg';
import vendorAddProductsPage from '@/assets/forTransition/4vendorAddProductsPage.jpeg';
import vendorProductsPageWithProduct from '@/assets/forTransition/5vendorProductsPageWithroduct.jpeg';
import buyerViewingProducts from '@/assets/forTransition/6buyerViewingProducts.jpeg';
import buyerViewingProductDetails from '@/assets/forTransition/7buyerViewingProductDetails.jpeg';
import buyerCheckingOut from '@/assets/forTransition/8buyerCheckingOut.jpeg';

interface FlowStep {
  id: number;
  image: string;
  title: string;
  description: string;
  category: 'vendor' | 'buyer';
}

const flowSteps: FlowStep[] = [
  {
    id: 1,
    image: vendorSignIn,
    title: "Vendor Registration",
    description: "Vendors sign up and join the platform",
    category: 'vendor'
  },
  {
    id: 2,
    image: vendorDashboard,
    title: "Vendor Dashboard",
    description: "Access comprehensive business analytics",
    category: 'vendor'
  },
  {
    id: 3,
    image: vendorProductsPage,
    title: "Product Management",
    description: "View and manage product inventory",
    category: 'vendor'
  },
  {
    id: 4,
    image: vendorAddProductsPage,
    title: "Add New Products",
    description: "Easily add products to the catalog",
    category: 'vendor'
  },
  {
    id: 5,
    image: vendorProductsPageWithProduct,
    title: "Product Catalog",
    description: "Products ready for customers to discover",
    category: 'vendor'
  },
  {
    id: 6,
    image: buyerViewingProducts,
    title: "Browse Products",
    description: "Customers explore available products",
    category: 'buyer'
  },
  {
    id: 7,
    image: buyerViewingProductDetails,
    title: "Product Details",
    description: "Detailed product information and reviews",
    category: 'buyer'
  },
  {
    id: 8,
    image: buyerCheckingOut,
    title: "Buy Now, Pay Later",
    description: "Seamless checkout with flexible payment",
    category: 'buyer'
  }
];

export default function FlowTransition() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % flowSteps.length);
    }, 4000); // Change every 4 seconds for better viewing

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setIsPlaying(false);
    // Resume auto-play after 6 seconds
    setTimeout(() => setIsPlaying(true), 6000);
  };

  const currentStepData = flowSteps[currentStep];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Display Area */}
      <div className="relative mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Modern Image Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16A085]/20 to-[#8DEB6E]/20 p-1">
              <div className="relative overflow-hidden rounded-3xl bg-[#0E161B] shadow-2xl">
                <img
                  src={currentStepData.image}
                  alt={currentStepData.title}
                  className="w-full h-[350px] md:h-[500px] object-cover"
                />
                
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E161B]/95 via-[#0E161B]/20 to-transparent" />
                
                {/* Floating Content Card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-[#0E161B]/80 backdrop-blur-xl border border-[#16A085]/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                          currentStepData.category === 'vendor' 
                            ? 'bg-gradient-to-r from-[#16A085] to-[#16A085]/80 text-white' 
                            : 'bg-gradient-to-r from-[#8DEB6E] to-[#8DEB6E]/80 text-[#0E161B]'
                        }`}>
                          {currentStepData.category}
                        </span>
                      </div>
                      <span className="text-[#8DEB6E] text-sm font-medium bg-[#8DEB6E]/10 px-3 py-1 rounded-full">
                        {currentStep + 1} / {flowSteps.length}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                      {currentStepData.title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {currentStepData.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modern Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-[#16A085]/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#16A085] to-[#8DEB6E] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / flowSteps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {flowSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-[#8DEB6E] scale-110 shadow-lg shadow-[#8DEB6E]/50'
                  : 'bg-[#16A085]/30 hover:bg-[#16A085]/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modern Step Navigation Grid - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
        {flowSteps.map((step, index) => (
          <motion.button
            key={step.id}
            onClick={() => handleStepClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
              index === currentStep
                ? 'ring-2 ring-[#8DEB6E] shadow-lg shadow-[#8DEB6E]/25'
                : 'hover:ring-2 hover:ring-[#16A085]/50'
            }`}
          >
            <div className="relative aspect-video">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 transition-all duration-300 ${
                index === currentStep
                  ? 'bg-[#8DEB6E]/20'
                  : 'bg-[#0E161B]/40 group-hover:bg-[#16A085]/20'
              }`} />
              {index === currentStep && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#8DEB6E] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#0E161B]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 bg-[#0E161B]/90 backdrop-blur-sm">
              <div className="text-xs text-white font-medium truncate">
                {step.title}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modern Control Panel */}
      <div className="flex justify-center">
        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#16A085] to-[#8DEB6E] text-[#0E161B] font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#8DEB6E]/25"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause Demo
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Demo
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}