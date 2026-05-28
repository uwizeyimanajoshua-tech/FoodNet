import React, { useState, useEffect } from "react";
import { Star, MapPin, Award, Play, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export function ChefProfile() {
  const { id } = useParams();
  const [chefInfo, setChefInfo] = useState<{ name: string; avatar: string; quote: string } | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchChefData = async () => {
      if (!id) return;
      try {
        // Fetch current food
        const docRef = doc(db, "foods", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const foodData = docSnap.data();
          const chef = foodData.chef || {
            name: "Master Chef N. Karisa (NK)",
            avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
            quote: "Traditional Rwandan foods are a gateway to our culinary soul."
          };
          setChefInfo(chef);

          // Now find other signature recipes by the same chef!
          const allFoodsSnap = await getDocs(collection(db, "foods"));
          const chefRecipes: any[] = [];
          allFoodsSnap.forEach((foodDoc) => {
            const data = foodDoc.data();
            if (data.chef?.name === chef.name) {
              chefRecipes.push({ id: foodDoc.id, ...data });
            }
          });
          setRecipes(chefRecipes);
        } else {
          // Fallback to defaults
          setChefInfo({
            name: "Chef N. Karisa (NK)",
            avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
            quote: "Traditional feeds of Kirehe represent our deep-seated culture."
          });
        }
      } catch (err) {
        console.error("Error loading chef profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gathering Chef Profile...</p>
      </div>
    );
  }

  const activeChef = chefInfo || {
    name: "Chef N. Karisa (NK)",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    quote: "Traditional feeds of Kirehe represent our deep-seated culture."
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="h-64 md:h-80 bg-orange-600 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-65" alt="Chef Cover Banner" />
        
        <Link to="/restaurants" className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl font-black text-xs text-gray-900 shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all">
          <ArrowLeft size={16} />
          Back Foods
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                <img 
                  src={activeChef.avatar || "https://i.pravatar.cc/300?u=chef"} 
                  className="w-48 h-48 rounded-[3rem] border-8 border-white shadow-2xl -mt-24 md:-mt-32 object-cover" 
                  alt={activeChef.name} 
                />
                <div className="flex-grow space-y-4 pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{activeChef.name}</h1>
                      <div className="flex items-center gap-4 text-gray-500 font-medium justify-center md:justify-start mt-1">
                        <span className="flex items-center gap-1"><MapPin size={16} className="text-orange-500" /> Kirehe, Rwanda</span>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                        <span className="flex items-center gap-1 text-orange-600 font-bold"><Award size={16} /> Verified Culinary Expert</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`px-8 py-3 rounded-2xl font-black text-sm shadow-lg transition-all ${
                          isFollowing ? "bg-orange-55 border-2 border-orange-600 text-orange-600 bg-orange-50" : "bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700"
                        }`}
                      >
                        {isFollowing ? "Following ✓" : "Follow Chef"}
                      </button>
                      <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-3 rounded-2xl border transition-all ${
                          isLiked ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl font-medium">
                    "{activeChef.quote || "Traditional cooking connects us to the heart of Rwanda."}"
                  </p>
                  <div className="flex gap-8 justify-center md:justify-start pt-4 border-t border-gray-50">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">{isFollowing ? "124.1k" : "124k"}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">{recipes.length}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Signature Dishes</p>
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
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Signature Recipes</h2>
              {recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recipes.map((dish) => (
                    <Link to={`/food/${dish.id}`} key={dish.id} className="block group">
                      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 cursor-pointer hover:shadow-xl hover:border-orange-100 transition-all transform hover:-translate-y-1">
                        <img src={dish.image} className="w-24 h-24 rounded-2xl object-cover shrink-0" alt={dish.name} />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">{dish.name}</h4>
                          <p className="text-orange-600 font-extrabold text-lg mt-1">{dish.price} RWF</p>
                          <span className="mt-3 text-[10px] font-black text-gray-400 group-hover:text-orange-600 uppercase tracking-widest block">
                            Order Now →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 text-center rounded-[2.5rem] border border-gray-50">
                  <span className="text-gray-300 block text-4xl mb-2">🍽️</span>
                  <p className="text-sm text-gray-400 font-bold">This chef is preparing secret recipes. Stay tuned!</p>
                </div>
              )}
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
                 <h4 className="text-xl font-bold mb-2">Art of Rwandan Isombe</h4>
                 <p className="text-sm text-white/50 mb-6 font-medium">Learn cassava leaf prep rituals with custom spices in Kirehe.</p>
                 <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-gray-900" alt="Viewer avatar" />)}
                   <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-[10px] font-bold">+4.2k</div>
                 </div>
               </div>
               <button className="w-full bg-orange-600 py-4 rounded-2xl font-bold shadow-xl shadow-orange-950 transition-all hover:bg-orange-700 flex items-center justify-center gap-3 active:scale-95">
                 <Play size={18} fill="white" />
                 Set Reminder
               </button>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50">
               <h3 className="text-2xl font-bold text-gray-900 mb-8">Fan Feedback</h3>
               <div className="space-y-6">
                 {[
                   { user: "Sarah L.", comment: "Excellent meals. Prepared with local traditional love!", rating: 5 },
                   { user: "Tom H.", comment: "Authentic food. Instantly delivered warm to my doorstep.", rating: 5 },
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
