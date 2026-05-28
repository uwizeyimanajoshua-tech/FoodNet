import React from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCart } from "../components/CartContext";

export function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    total, 
    formatPrice 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center px-4 space-y-8">
          <div className="w-28 h-28 bg-orange-100/50 rounded-[2.5rem] flex items-center justify-center text-orange-600 mx-auto shadow-inner">
            <ShoppingCart size={48} className="animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Cart is Empty</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Explore our 50+ exquisite local foods prepared by N. Karisa and Kirehe local master chefs right now!
            </p>
          </div>
          <Link to="/restaurants" className="block">
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-orange-100">
              Browse Kirehe Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
          </div>
          <button 
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={16} />
            Clear Basket
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.food.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8"
              >
                <img src={item.food.image} className="w-32 h-32 rounded-[2rem] object-cover shadow-lg" alt={item.food.name} />
                <div className="flex-grow space-y-1 text-center md:text-left">
                  <span className="text-[10px] font-black text-orange-600 tracking-widest uppercase bg-orange-50 px-2.5 py-1 rounded-md">
                    {item.food.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 pt-1">{item.food.name}</h3>
                  {item.customization ? (
                    <p className="text-orange-600 font-semibold text-xs italic bg-orange-50/50 px-3 py-1.5 rounded-xl inline-block mt-1">
                      Note: "{item.customization}"
                    </p>
                  ) : (
                    <p className="text-gray-400 font-medium text-xs">Standard Chef Recipe</p>
                  )}
                  <p className="text-gray-900 font-black text-lg pt-2">{formatPrice(item.food.price)}</p>
                </div>
                <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 font-black">
                  <button 
                    onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                    className="text-gray-400 hover:text-orange-600 transition-colors p-1"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-extrabold text-lg w-6 text-center text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-orange-600 transition-colors p-1"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.food.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-2xl"
                >
                  <Trash2 size={24} />
                </button>
              </motion.div>
            ))}

            <Link to="/restaurants" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all pt-4">
              <span>← Continue Shopping</span>
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-orange-100/20 border border-orange-50 sticky top-32">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-8 pb-6 border-b border-gray-50">Order Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-gray-600 font-medium text-lg">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-lg">
                  <span>Delivery Fee</span>
                  <span className="text-gray-900 font-bold">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-lg">
                  <span>Tax</span>
                  <span className="text-gray-900 font-bold">0 RWF</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/checkout">
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                    Continue to Order
                    <ArrowRight size={22} />
                  </button>
                </Link>
                <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-wider">Fast Courier Service in Kirehe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
