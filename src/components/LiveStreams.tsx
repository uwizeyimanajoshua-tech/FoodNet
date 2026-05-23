import React from "react";
import { Play, Users, Star } from "lucide-react";
import { motion } from "motion/react";

const STREAMS = [
  { id: '1', title: "Authentic Thai Green Curry", chefName: "Chef Somchai", viewers: 1240, thumbnail: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=400", avatar: "https://i.pravatar.cc/100?u=1" },
  { id: '2', title: "Perfect Sourdough Bread", chefName: "Baker James", viewers: 850, thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400", avatar: "https://i.pravatar.cc/100?u=2" },
  { id: '3', title: "Mexican Street Tacos", chefName: "Chef Elena", viewers: 2100, thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", avatar: "https://i.pravatar.cc/100?u=3" },
  { id: '4', title: "Japanese Ramen Secrets", chefName: "Chef Kenji", viewers: 3600, thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400", avatar: "https://i.pravatar.cc/100?u=4" },
];

export function LiveStreams() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50" id="live-streams">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-950 flex items-center gap-3">
              <span className="w-4 h-4 bg-red-600 rounded-full animate-ping"></span>
              Live Cooking Now
            </h2>
            <p className="text-gray-600 max-w-xl">
              Watch professional chefs cook in real-time, ask questions, and learn secret recipes.
            </p>
          </div>
          <button className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-orange-600 pb-1">
            Browse All Streams <Play size={16} fill="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STREAMS.map((stream, idx) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] mb-4 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
                <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold text-[10px]">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
                
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold text-[10px]">
                  <Users size={12} />
                  {stream.viewers.toLocaleString()}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play size={24} fill="white" className="text-white ml-1" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <img src={stream.avatar} alt={stream.chefName} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{stream.chefName}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
