import React from "react";
import { Star, Users, MapPin, Award, Play, MessageCircle, Heart } from "lucide-react";
import { motion } from "motion/react";

export function ChefProfile() {
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-64 md:h-80 bg-orange-600 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                <img src="https://i.pravatar.cc/300?u=chef" className="w-48 h-48 rounded-[3rem] border-8 border-white shadow-2xl -mt-24 md:-mt-32" alt="Chef" />
                <div className="flex-grow space-y-4 pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h1 className="text-4xl font-extrabold text-gray-900">Chef N. Karisa (NK)</h1>
                      <div className="flex items-center gap-4 text-gray-500 font-medium justify-center md:justify-start mt-1">
                        <span className="flex items-center gap-1"><MapPin size={16} /> Kirehe, Rwanda</span>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                        <span className="flex items-center gap-1 text-orange-600 font-bold"><Award size={16} /> Master Chef NK</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200">Follow</button>
                      <button className="bg-gray-100 text-gray-600 p-3 rounded-2xl hover:bg-gray-200 transition-all"><Heart size={20} /></button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                    Master Chef N. Karisa brings the authentic flavors of Rwanda with a modern twist. With deep roots in Kirehe culinary traditions, NK is dedicated to sharing the soul of Rwandan hospitality through every dish.
                  </p>
                  <div className="flex gap-8 justify-center md:justify-start pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">124k</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">452</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Streams</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">4.9</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Signature Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "Cacio e Pepe Classic", price: 18.00, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400" },
                  { name: "Roman Style Pizza", price: 22.00, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" },
                ].map((dish, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group cursor-pointer hover:shadow-xl transition-all">
                    <img src={dish.img} className="w-24 h-24 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{dish.name}</h4>
                      <p className="text-orange-600 font-extrabold text-lg mt-1">${dish.price.toFixed(2)}</p>
                      <button className="mt-3 text-xs font-bold text-gray-400 hover:text-orange-600 uppercase tracking-widest">Order Now →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-12">
            <div className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-[80px] opacity-40"></div>
               <h3 className="text-2xl font-bold mb-8 relative z-10">Next Live Class</h3>
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mb-8">
                 <div className="flex gap-4 items-center mb-6">
                   <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold animate-pulse uppercase tracking-wider">Upcoming</div>
                   <span className="text-xs font-bold text-white/60">Tomorrow • 6:00 PM</span>
                 </div>
                 <h4 className="text-xl font-bold mb-2">Secrets of the Perfect Ravioli</h4>
                 <p className="text-sm text-white/50 mb-6">Learn the art of filling and shaping delicate pasta dough.</p>
                 <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-gray-900" />)}
                   <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold">+4.2k</div>
                 </div>
               </div>
               <button className="w-full bg-orange-600 py-4 rounded-2xl font-bold shadow-xl shadow-orange-950 transition-all hover:bg-orange-700 flex items-center justify-center gap-3">
                 <Play size={18} fill="white" />
                 Set Reminder
               </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50">
               <h3 className="text-2xl font-bold text-gray-900 mb-8">Fan Feedback</h3>
               <div className="space-y-6">
                 {[
                   { user: "Sarah L.", comment: "The best Carbonara I've ever made in my life!", rating: 5 },
                   { user: "Tom H.", comment: "Mario's tips on kneading dough are game-changers.", rating: 5 },
                 ].map((rev, i) => (
                   <div key={i} className="space-y-2 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                     <div className="flex items-center gap-1 text-orange-500">
                       {[...Array(rev.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                     </div>
                     <p className="text-gray-600 text-sm font-medium">"{rev.comment}"</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">— {rev.user}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-8 text-center text-orange-600 font-bold hover:underline">See All 1.2k Reviews</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
