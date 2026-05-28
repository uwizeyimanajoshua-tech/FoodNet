import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Play, Users, ArrowRight, ShieldCheck, Timer, Utensils, Flame, Leaf, Coffee, Instagram, Facebook, Twitter, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import { SEO } from "../components/SEO";

export function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const slides = [
    { title: t("common.welcome"), subtitle: t("common.tagline"), image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" },
    { title: t("home.hero.slides.2.title"), subtitle: t("home.hero.slides.2.subtitle"), image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=2070&auto=format&fit=crop" },
    { title: t("home.hero.slides.0.title"), subtitle: t("home.hero.slides.0.subtitle"), image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2070&auto=format&fit=crop" }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen">
      <SEO 
        title="FoodNet Rwanda | Order Food Online" 
        description="FoodNet is a Rwanda-based online food delivery platform helping users discover restaurants and order meals quickly and easily."
        keywords="food delivery Rwanda, restaurants Rwanda, order food Kigali, FoodNet Rwanda"
      />
      {/* Hero Slider Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src={slides[currentSlide].image} 
              className="w-full h-full object-cover scale-110"
              alt="Slide Background"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="container mx-auto px-6 relative z-20">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-orange-600/20 text-orange-500 font-bold mb-6 backdrop-blur-md border border-orange-500/30">
              📍 {t("home.hero.platform")}
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              {slides[currentSlide].title.split(' ').map((word: string, i: number) => (
                <span key={i} className={word === "HEART" || word === "FRESH" || word === "CHEF-LED" || word === "UMUTIMA" || word === "BISHYA" || word === "BORA" || word === "CŒUR" || word === "SAVOUREZ" || word === "AMSHA" ? "text-orange-500" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <p className="text-2xl text-gray-200 mb-10 max-w-2xl font-medium">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/restaurants">
                <button className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/30">
                  <ShoppingBag size={22} />
                  {t("common.order_now")}
                </button>
              </Link>
              <Link to="/streams">
                <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-[2rem] font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105">
                  <Play size={22} />
                  {t("home.cta.watchStreams")}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-6 z-30 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? "w-12 bg-orange-600" : "w-4 bg-white/30"}`}
            />
          ))}
        </div>
      </section>

      {/* Popular Foods / Order Food Section */}
      <section className="py-24 bg-[#fdfaf6]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-4 block">{t("home.popular.tag")}</span>
              <h2 className="text-5xl font-black text-gray-950 tracking-tight leading-[0.9] mb-4">
                {t("home.popular.title")} <span className="text-orange-600">Kirehe</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg italic">{t("home.popular.subtitle")}</p>
            </div>
            <Link to="/restaurants">
              <button className="px-10 py-5 bg-orange-600 text-white rounded-[2rem] font-bold text-lg flex items-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20">
                {t("home.popular.orderNow")}
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Isombe with Rice", price: "4,500 RWF", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&fit=crop" },
              { name: "Grilled Tilapia", price: "8,000 RWF", img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&fit=crop" },
              { name: "Brochette Platter", price: "6,500 RWF", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&fit=crop" },
              { name: "Akabenz Special", price: "5,000 RWF", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&fit=crop" }
            ].map((food, i) => (
              <motion.div 
                key={food.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-4 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                  <img src={food.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={food.name} />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-black text-orange-600 shadow-sm uppercase tracking-widest">
                    {t("home.popular.topChoice")}
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{food.name}</h3>
                  <p className="text-orange-600 font-black text-lg">{food.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Showcase Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src="https://images.unsplash.com/photo-1517248135467-4c7ed9d421bb?w=600&fit=crop" 
              className="rounded-[2.5rem] shadow-xl w-full h-80 object-cover"
              alt="Restaurant 1"
            />
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&fit=crop" 
              className="rounded-[2.5rem] shadow-xl w-full h-80 object-cover mt-12"
              alt="Restaurant 2"
            />
          </div>
          <div>
            <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-4 block">{t("home.restaurants.tag")}</span>
            <h2 className="text-5xl font-black text-gray-950 tracking-tight leading-[0.9] mb-8">
              {t("home.restaurants.title").split('Best')[0]} <span className="text-orange-600">{t("home.restaurants.title").includes('Dining') ? 'Dining' : 'Kurya'}</span> {t("home.restaurants.title").split('Best')[1] || ""}
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
              {t("home.restaurants.description")}
            </p>
            <div className="space-y-6">
              {[
                { title: t("home.restaurants.partnerRestaurants"), desc: t("home.restaurants.partnerRestaurantsDesc") },
                { title: t("home.restaurants.exclusiveDeals"), desc: t("home.restaurants.exclusiveDealsDesc") }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">{item.title}</h4>
                    <p className="text-gray-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join the Community CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-12 bg-green-50 rounded-[4rem] border border-green-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-green-900 mb-4">{t("home.cta.watchStreams")}</h3>
              <p className="text-green-700 font-medium text-lg mb-8 max-w-sm">
                {t("home.cta.watchStreamsDesc")}
              </p>
              <Link to="/streams">
                <button className="px-8 py-4 bg-green-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-green-700 transition-all">
                  {t("home.cta.watchNow")}
                  <Play size={20} fill="white" />
                </button>
              </Link>
            </div>
            <Play size={120} className="absolute -bottom-10 -right-10 text-green-600/10 rotate-12 group-hover:rotate-0 transition-transform" />
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="group p-12 bg-blue-50 rounded-[4rem] border border-blue-100 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-blue-900 mb-4">{t("home.cta.becomeChef")}</h3>
              <p className="text-blue-700 font-medium text-lg mb-8 max-w-sm">
                {t("home.cta.becomeChefDesc")}
              </p>
              <Link to="/signup">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold flex items-center gap-3 hover:bg-blue-700 transition-all">
                  {t("home.cta.applyNow")}
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
            <Utensils size={120} className="absolute -bottom-10 -right-10 text-blue-600/10 rotate-12 group-hover:rotate-0 transition-transform" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
