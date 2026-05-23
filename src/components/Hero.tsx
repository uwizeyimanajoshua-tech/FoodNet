import React from "react";
import { motion } from "motion/react";
import { Search, MapPin, ChevronRight, Play, ShoppingCart } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" id="hero">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-red-50 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              NEW: Live Interactive Cooking Classes
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-gray-950">
              Cook, Watch & <br />
              <span className="text-orange-600">Taste the Joy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              The only platform where you can watch world-class chefs live, order the ingredients, or have the exact meal delivered to your doorstep.
            </p>

            <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-orange-200/50 flex flex-col md:flex-row items-center gap-2 max-w-2xl mb-8">
              <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3">
                <Search size={20} className="text-orange-500 mr-3" />
                <input
                  type="text"
                  placeholder="What are you craving?"
                  className="bg-transparent border-none outline-none w-full font-medium"
                />
              </div>
              <div className="flex-1 flex items-center px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-3">
                <MapPin size={20} className="text-orange-500 mr-3" />
                <input
                  type="text"
                  placeholder="Current Location"
                  className="bg-transparent border-none outline-none w-full font-medium"
                />
              </div>
              <button className="w-full md:w-auto bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-300">
                Explore
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    alt="User"
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                  +2k
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">
                <span className="text-orange-600 font-bold">2,100+</span> happy foodies online now
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-3xl shadow-orange-100">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                alt="Delicious Food"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Chef Gordon is Live!</h3>
                  <p className="text-white/80 text-sm">Homemade Italian Risotto Masterclass</p>
                </div>
                <div className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  LIVE
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden lg:block bg-white p-4 rounded-2xl shadow-xl w-48"
            >
              <div className="flex gap-3 items-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Trending</p>
                  <p className="font-bold text-sm">Sushi Set</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-green-500"></div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 hidden lg:block bg-white p-4 rounded-2xl shadow-xl w-56 border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full overflow-hidden border-2 border-orange-200">
                  <img src="https://i.pravatar.cc/100?u=chef" alt="Chef" />
                </div>
                <div>
                  <p className="font-bold text-sm">Chef Marco</p>
                  <p className="text-xs text-gray-500">Mastering Pasta</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
