import React, { useState } from "react";
import { Search, MapPin, Star, Clock, Filter, ShoppingBag, Layers, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FoodItem } from "../data/foods";
import { useCart } from "../components/CartContext";
import { useFoods } from "../components/FoodsContext";
import { SEO } from "../components/SEO";

const CATEGORIES = ["All", "Traditional", "Grill", "Stews", "Street Food", "Beverages", "Dessert"] as const;

export function Restaurants() {
  const { addToCart, formatPrice } = useCart();
  const { foods, loading } = useFoods();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState("");

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || food.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (food: FoodItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      <SEO 
        title="Restaurants in Rwanda | FoodNet"
        description="Explore and order from premium local restaurants and master chefs in Rwanda. FoodNet connects you to authentic local cuisine delivered straight to your door."
        keywords="food delivery Rwanda, restaurants Rwanda, order food Kigali, FoodNet Rwanda, gourmet meals"
      />
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="text-center space-y-2">
            <Loader2 className="animate-spin text-orange-600 mx-auto" size={32} />
            <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Refreshing Culinary Station...</p>
          </div>
        </div>
      )}
      {/* Banner & Search Section */}
      <div className="bg-orange-50/70 py-16 dark:bg-gray-900/40 border-b border-orange-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-orange-600 font-black text-xs uppercase tracking-widest bg-orange-100/60 px-4 py-2 rounded-full mb-4 inline-block">
            Kirehe Culinary Station
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-6 leading-none tracking-tight">
            Discover Exquisite Foods
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded-[2.5rem] shadow-xl shadow-orange-100/50 max-w-4xl border border-gray-100">
            <div className="flex-grow flex items-center px-4 border-r border-gray-100 py-3 w-full">
              <Search size={22} className="text-orange-500 mr-3 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Isombe, Tilapia, Akabenz or other delicacies..." 
                className="w-full bg-transparent border-none outline-none font-semibold text-gray-800 placeholder:text-gray-300" 
              />
            </div>
            <div className="flex-grow flex items-center px-4 py-3 w-full md:w-48">
              <MapPin size={22} className="text-orange-500 mr-3 shrink-0" />
              <input 
                type="text" 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Kirehe District" 
                className="w-full bg-transparent border-none outline-none font-semibold text-gray-800 placeholder:text-gray-300" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-3">
            <Layers className="text-orange-600" size={20} />
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Browse by Category</h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-gray-100">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl font-black text-xs tracking-wider uppercase transition-all whitespace-nowrap active:scale-95 ${
                  activeCategory === cat 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                    : "bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100 max-w-lg mx-auto space-y-4">
            <p className="text-4xl text-orange-200 font-extrabold pb-2">🥗</p>
            <h3 className="text-2xl font-black text-gray-900">No dishes found</h3>
            <p className="text-gray-500 font-medium">We couldn't find any results matching "{searchTerm}". Try exploring other categories!</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFoods.map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 6) * 0.05 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/30 transition-all group flex flex-col justify-between"
              >
                <Link to={`/food/${food.id}`} className="block flex-grow">
                  <div className="relative h-60 overflow-hidden m-4 rounded-[2rem] shadow-md">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-1 font-extrabold text-sm text-gray-900 border border-white/20">
                      <Star size={14} className="text-orange-500 fill-orange-500" />
                      {food.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider">
                      {food.category}
                    </div>
                  </div>
                  <div className="p-6 pt-2 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {food.name}
                      </h3>
                      <span className="text-orange-600 font-black text-lg shrink-0">
                        {formatPrice(food.price)}
                      </span>
                    </div>
                    <p className="text-gray-400 font-semibold text-sm line-clamp-2">
                      {food.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {food.deliveryTime}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span className="text-green-600">Free Delivery</span>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-50 mt-4 gap-4">
                  <div className="text-xs">
                    <span className="text-gray-400 font-semibold">Chef Choice: </span>
                    <span className="font-bold text-gray-700 block">{food.chef.name.split(' ')[2] || food.chef.name}</span>
                  </div>
                  <button 
                    onClick={(e) => handleQuickAdd(food, e)}
                    className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    Add <ShoppingBag size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
