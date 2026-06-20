import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search, Play, LogOut, ShieldCheck, ChevronDown, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";
import { useCart } from "./CartContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { user, logout, isAdmin, userData } = useAuth();
  const { t } = useLanguage();
  const { itemsCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHome ? "bg-white shadow-sm py-4 border-b border-gray-100" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/foodnet.png" 
              alt="FoodNet Rwanda Logo" 
              className={`h-20 w-auto transition-transform group-hover:scale-105 ${!isScrolled && isHome ? "brightness-0 invert" : ""}`}
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-10 font-black text-xs tracking-widest ${!isScrolled && isHome ? "text-white/90" : "text-gray-500"}`}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="hover:text-orange-600 transition-colors relative group uppercase"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher isScrolled={isScrolled} isHome={isHome} />

            <Link to="/cart" className={`p-3 rounded-2xl transition-all relative ${!isScrolled && isHome ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}>
              <ShoppingCart size={20} />
              {itemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {itemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-3 p-1 pr-4 rounded-full border transition-all ${!isScrolled && isHome ? "bg-white/10 border-white/20 text-white" : "bg-gray-50 border-gray-100 text-gray-900"}`}>
                  {userData?.photoURL || user.photoURL ? (
                    <img src={userData?.photoURL || user.photoURL} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-black">
                      {(userData?.displayName || user.displayName || "")?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-bold hidden lg:block">{(userData?.displayName || user.displayName || "")?.split(' ')[0]}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-3xl shadow-2xl py-4 flex flex-col gap-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[60]">
                  {isAdmin && (
                    <Link to="/admin" className="px-6 py-3 hover:bg-orange-50 hover:text-orange-600 font-bold transition-colors flex items-center gap-2">
                      <Shield size={18} />
                      {t("admin")}
                    </Link>
                  )}
                  <Link to="/dashboard" className="px-6 py-3 hover:bg-orange-50 hover:text-orange-600 font-bold transition-colors flex items-center gap-2">
                    <User size={18} />
                    {t("nav.dashboard")}
                  </Link>
                  <Link to="/profile" className="px-6 py-3 hover:bg-orange-50 hover:text-orange-600 font-bold transition-colors flex items-center gap-2">
                    <User size={18} />
                    Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="px-6 py-3 hover:bg-red-50 hover:text-red-600 font-bold transition-colors flex items-center gap-2 text-left w-full"
                  >
                    <LogOut size={18} />
                    {t("common.logout")}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button 
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 uppercase ${!isScrolled && isHome ? "bg-white text-orange-600 shadow-xl" : "bg-orange-600 text-white shadow-xl shadow-orange-600/20"}`}
                >
                  <User size={18} />
                  {t("common.sign_in")}
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${!isScrolled && isHome ? "text-white" : "text-gray-900"}`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 font-black text-sm tracking-widest text-gray-900">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-orange-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 uppercase tracking-widest">{t("nav.admin")}</Link>}
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 uppercase tracking-widest">{t("nav.dashboard")}</Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 uppercase tracking-widest">Profile</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left text-red-600 uppercase tracking-widest">{t("common.logout")}</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-orange-600 uppercase tracking-widest">{t("common.sign_in")}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
