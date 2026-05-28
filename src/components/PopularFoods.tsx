import React from "react";
import { Star, Clock, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FoodItem } from "../data/foods";
import { useCart } from "../components/CartContext";
import { useFoods } from "../components/FoodsContext";

export function PopularFoods() {
  const { addToCart, formatPrice } = useCart();
  const { foods } = useFoods();
  const [likedIds, setLikedIds] = React.useState<Record<string, boolean>>({});

  // Display popular foods first or a subset of 8 representative items
  const popularFoods = foods.filter(f => f.isPopular).slice(0, 8);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (food: FoodItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1);
  };

  return (
    <section className="py-20" id="popular-foods">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-950">Most Popular Foods</h2>
            <p className="text-gray-600 max-w-xl font-medium">
              Discover Rwanda's favorite delicacies in Kirehe. Hand-picked options curated by Executive Chef N. Karisa and local culinary masters.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-200">Delivery</button>
            <button className="bg-white border border-gray-100 text-gray-600 px-6 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-all">Takeaway</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularFoods.map((food, idx) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-100/50 border border-transparent hover:border-orange-200 hover:shadow-orange-100/50 transition-all group relative flex flex-col justify-between"
            >
              <Link to={`/food/${food.id}`} className="block flex-grow">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button 
                    onClick={(e) => toggleLike(food.id, e)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                      likedIds[food.id] 
                        ? "bg-red-50 text-red-500" 
                        : "bg-white/80 text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart size={20} className={likedIds[food.id] ? "fill-red-500" : ""} />
                  </button>
                  <div className="absolute bottom-4 left-4 inline-flex bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-gray-900 gap-1.5 items-center shadow-sm">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                    {food.rating} ({food.reviews})
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {food.name}
                    </h3>
                    <span className="text-orange-600 font-extrabold text-base shrink-0">
                      {formatPrice(food.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 pb-4 border-b border-gray-50">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {food.deliveryTime}</span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                    <span className="text-green-600 font-bold">Free Del.</span>
                  </div>
                </div>
              </Link>

              <div className="px-2 pt-4 flex gap-2 w-full">
                <button 
                  onClick={(e) => handleQuickAdd(food, e)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-100"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
