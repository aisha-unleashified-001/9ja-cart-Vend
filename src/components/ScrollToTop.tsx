'use client';

import { useEffect, useState, useRef } from 'react';
import {  CircleFadingArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPosition = useRef(0);

  const handleScroll = () => {
    const currentPosition = window.pageYOffset;
    
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

  
    // Show if past 300px AND scrolling (either direction)
    if (currentPosition > 300) {
      setIsVisible(true);
      
      // Hide after scrolling stops
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    } else {
      setIsVisible(false);
    }

    lastScrollPosition.current = currentPosition;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
        >
          <Button
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 p-0 shadow-lg"
            variant="default"
          >
            <CircleFadingArrowUp size={30} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}












