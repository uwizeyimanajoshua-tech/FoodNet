import React, { useState } from "react";
import { Star, Clock, Heart, ShoppingBag, ArrowLeft, Share2, CornerDownRight, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { FOODS_DATA } from "../data/foods";
import { useCart } from "../components/CartContext";
import { useFoods } from "../components/FoodsContext";
import { SEO } from "../components/SEO";
import { toast } from "react-hot-toast";

export function FoodDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, formatPrice } = useCart();
  const { foods } = useFoods();

  const food = foods.find((item) => item.id === id) || FOODS_DATA.find((item) => item.id === id) || FOODS_DATA[0];

  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(food, quantity, customization);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Correctly copied dish URL to clipboard!");
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      <SEO 
        title={`${food.name} - Order on FoodNet`}
        description={`Savor our delicious ${food.name}. ${food.description || "Freshly handmade by our master chefs, delivered direct to your door in Kirehe, Rwanda."}`}
        keywords={`${food.name}, ${food.category}, Rwanda Food, FoodNet`}
        image={food.image}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 font-extrabold mb-10 hover:text-orange-600 transition-colors group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Menu
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
          {/* Left panel: Image gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-100 rounded-[2.5rem] overflow-hidden aspect-square shadow-xl relative group">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-orange-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  {food.category}
                </span>
                {food.isPopular && (
                  <span className="bg-yellow-400 text-gray-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                    Popular Choice
                  </span>
                )}
              </div>
            </div>
            
            {/* Food properties grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Prepare Time</span>
                <span className="text-base font-black text-gray-900 mt-1 flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-600" />
                  {food.deliveryTime}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Review Rating</span>
                <span className="text-base font-black text-gray-900 mt-1 flex items-center gap-1.5">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  {food.rating} ({food.reviews})
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center col-span-2 md:col-span-1">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Eco-Delivery</span>
                <span className="text-base font-black text-green-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  Free Option
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right panel: Information & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                  {food.name}
                </h1>
                <div className="flex gap-3 shrink-0">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      isLiked 
                        ? "bg-red-50 border-red-200 text-red-500" 
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100"
                    }`}
                  >
                    <Heart size={20} className={isLiked ? "fill-red-500" : ""} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Price display */}
              <div className="text-3xl font-black text-orange-600 tracking-tight">
                {formatPrice(food.price)}
              </div>

              {/* Long Description and allergens */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  {food.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">100% Organic</span>
                  <span className="px-3.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl">Locally Grounded</span>
                  {food.isVegetarian && (
                    <span className="px-3.5 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-xl">Vegetarian Safe</span>
                  )}
                </div>
              </div>

              {/* Customization Note input */}
              <div className="space-y-3 pt-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-1.5">
                  <CornerDownRight size={14} /> Customization Request
                </label>
                <input 
                  type="text" 
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="e.g. Add extra akabanga oil, no green peppers..." 
                  className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none font-semibold border border-gray-100 focus:border-orange-500 transition-colors placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Quantity select & Add button */}
            <div className="space-y-6 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 shrink-0">
                  <button 
                    onClick={handleDecrease}
                    className="text-2xl font-black bg-white w-10 h-10 rounded-2xl shadow-sm hover:text-orange-600 active:scale-95 transition-transform flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black w-14 text-center text-gray-900">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    className="text-2xl font-black bg-white w-10 h-10 rounded-2xl shadow-sm hover:text-orange-600 active:scale-95 transition-transform flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-orange-600 text-white py-5 px-8 rounded-3xl font-black text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-600/30 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  <ShoppingBag size={22} />
                  Add to Cart • {formatPrice(food.price * quantity)}
                </button>
              </div>
            </div>

            {/* Chef signature section */}
            <div className="bg-orange-50/50 p-6 rounded-[2.5rem] border border-orange-100/70">
               <div className="flex items-center gap-4 mb-3">
                 <img 
                   src={food.chef.avatar} 
                   className="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover" 
                   alt={food.chef.name} 
                 />
                 <div>
                   <p className="font-extrabold text-sm text-gray-900">Curated by {food.chef.name}</p>
                   <Link 
                     to={`/chef/${food.id}`} 
                     className="text-[10px] text-orange-600 font-extrabold uppercase tracking-widest hover:underline"
                   >
                     View Chef Profile
                   </Link>
                 </div>
               </div>
               <p className="text-xs text-gray-500 italic font-medium">"{food.chef.quote}"</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
