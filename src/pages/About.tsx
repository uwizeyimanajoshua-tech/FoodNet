import React from "react";
import { motion } from "motion/react";
import { Utensils, Users, Award, Globe } from "lucide-react";
import { SEO } from "../components/SEO";

export function About() {
  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title="About Us | FoodNet Rwanda" 
        description="Learn more about FoodNet Rwanda, founded by Joshua Uwizeyimana. We bridge the gap between world-class culinary expertise and food lovers with live streams and express delivery." 
      />
      <section className="bg-orange-600 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Our Mission in Rwanda
          </motion.h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto font-medium">
            Founded by Joshua Uwizeyimana, FoodNet Rwanda is bridging the gap between world-class culinary expertise and food lovers through live interactivity and premium local delivery.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-gray-900">What is FoodNet?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              FoodNet isn't just another food delivery app. It's a culinary ecosystem where you can watch your favorite chefs cook live, ask them questions in real-time, and order the exact ingredients or the final dish right to your door.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe cooking is a social experience. By combining entertainment with commerce, we empower chefs to grow their influence and provide foodies with unparalleled access to top-tier gastronomy.
            </p>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl rotate-3 bg-orange-100">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" alt="Kitchen" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Utensils size={32} />, title: "Live Interaction", desc: "Real-time cooking streams with live chat." },
            { icon: <Users size={32} />, title: "Top Chefs", desc: "Access to world-renowned culinary masters." },
            { icon: <Award size={32} />, title: "Premium Quality", desc: "Hand-picked restaurants and fresh ingredients." },
            { icon: <Globe size={32} />, title: "Global Flavors", desc: "Cuisines from every corner of the world." },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] border border-transparent hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
