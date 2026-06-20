import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1,
              ease: "circOut",
              scale: { type: "spring", damping: 15 }
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-100 rounded-[3rem] blur-3xl opacity-50 animate-pulse" />
            <img 
              src="foodnet.png" 
              alt="FoodNet Logo" 
              className="h-48 w-auto relative z-10"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1, 
                    delay: i * 0.2 
                  }}
                  className="w-3 h-3 bg-orange-600 rounded-full"
                />
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
              Kirehe Rwanda Gateway
            </p>
          </motion.div>

          <div className="absolute bottom-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            Developed by Joshua Uwizeyimana
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
