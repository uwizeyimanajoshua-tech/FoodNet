import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Heart, Share2, Users, Send, CheckCircle2, ShoppingBag, 
  Radio, Sparkles, MessageSquare, Flame, Smile, TrendingUp, 
  BarChart3, Activity, Award, Volume2, VolumeX, AlertCircle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../components/AuthContext";
import { useCart } from "../components/CartContext";
import { FOODS_DATA, FoodItem } from "../data/foods";
import { toast } from "react-hot-toast";

interface ChatMessage {
  user: string;
  msg: string;
  avatar: string;
  isChef?: boolean;
}

interface StreamType {
  id: string;
  title: string;
  category: string;
  chefName: string;
  chefTitle: string;
  chefAvatar: string;
  viewersCount: number;
  image: string;
  videoPoster: string;
  youtubeId: string;
  description: string;
  initialChats: ChatMessage[];
  simulatedReplies: ChatMessage[];
}

const STREAMS_LIST: StreamType[] = [
  {
    id: "1",
    title: "The Art of Multi-Layered French Croissants",
    category: "Bakery / French",
    chefName: "Chef Jean-Luc",
    chefTitle: "French Pastry Master • Guest Instructor",
    chefAvatar: "https://i.pravatar.cc/100?u=chef",
    viewersCount: 3452,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "beOzS__-XpA",
    description: "Today we are diving into the complex art of French pastries. Join me as I show you how to get those perfect, buttery layers in your croissants. We'll be using premium ingredients that you can order directly from the shop section on your right!",
    initialChats: [
      { user: "Sarah J.", msg: "Does the butter need to be room temp?", avatar: "https://i.pravatar.cc/100?u=1" },
      { user: "Mike Chef", msg: "Wow, it looks so fluffy already!", avatar: "https://i.pravatar.cc/100?u=2" },
      { user: "FoodieLi", msg: "Just ordered the flour to follow along!", avatar: "https://i.pravatar.cc/100?u=3" },
      { user: "Chef Jean-Luc", msg: "Welcome everyone! Yes, room temp is best.", avatar: "https://i.pravatar.cc/100?u=chef", isChef: true },
      { user: "Dave R.", msg: "Can't wait to taste this!", avatar: "https://i.pravatar.cc/100?u=4" },
    ],
    simulatedReplies: [
      { user: "Clara M.", msg: "Mine is in the oven right now!", avatar: "https://i.pravatar.cc/100?u=6" },
      { user: "BakingGeek", msg: "Chef, does salted butter make a difference?", avatar: "https://i.pravatar.cc/100?u=7" },
      { user: "Chef Jean-Luc", msg: "Unsalted is preferred so you can fully control the salt balance!", avatar: "https://i.pravatar.cc/100?u=chef", isChef: true },
      { user: "Alex_P", msg: "Beautiful lamination layers!", avatar: "https://i.pravatar.cc/100?u=8" },
      { user: "FoodieLi", msg: "Oh, it's getting brown! Delicious!", avatar: "https://i.pravatar.cc/100?u=3" },
      { user: "RwandanPastry", msg: "Can you make these with sweet maize flour?", avatar: "https://i.pravatar.cc/100?u=10" },
      { user: "Chef Jean-Luc", msg: "Maize does not develop gluten in the same way, but it creates a delightfully crumbly crust!", avatar: "https://i.pravatar.cc/100?u=chef", isChef: true },
      { user: "Jeanne_D", msg: "Smells like a French boulevard bakery in Kigali!", avatar: "https://i.pravatar.cc/100?u=18" }
    ]
  },
  {
    id: "2",
    title: "Traditional Rwandan Isombe Masterclass",
    category: "Rwandan / Cassava",
    chefName: "Chef Joshua",
    chefTitle: "FoodNet Founder • Kirehe Culinary Lead",
    chefAvatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200",
    viewersCount: 4120,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "W6kZ8uG6608",
    description: "Welcome to Kirehe's culinary soul! Today, we are mastering traditional Rwandan Isombe—pounded cassava leaves cooked meticulously with pure peanut paste, fresh palm oil, and organic garden leeks. I will show you how we achieve the legendary peak tenderness from lakeside organic crops.",
    initialChats: [
      { user: "Gisa L.", msg: "Pounding cassava leaves by hand looks intense! Is there a food prep shortcut?", avatar: "https://i.pravatar.cc/100?u=11" },
      { user: "Keza K.", msg: "Oh, I love Kirehe honey! Will we use pure palm oil too?", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Chef Joshua", msg: "Welcome guys! Yes, traditional palm oil or sunflower oil is perfect. Pounding develops the true herbal aroma!", avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Muhire88", msg: "Ordered Isombe to follow along! Can't wait!", avatar: "https://i.pravatar.cc/100?u=13" },
      { user: "Eric Rwa", msg: "This smell is incredible, Kirehe's finest!", avatar: "https://i.pravatar.cc/100?u=14" },
    ],
    simulatedReplies: [
      { user: "Nshuti_P", msg: "Wow, is peak simmer time 3 or 4 hours?", avatar: "https://i.pravatar.cc/100?u=15" },
      { user: "Chef Joshua", msg: "The longer the better! At least 2.5 hours on a gentle volcanic charcoal flame to break down fibres.", avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Keza K.", msg: "Just added the Isombe to my cart, delivery is in less than 25 minutes! Kirehe courier is fast!", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Umutoni_F", msg: "Smells like grandmother's village kitchen!", avatar: "https://i.pravatar.cc/100?u=16" },
      { user: "Chef Joshua", msg: "Exactly, Umutoni! That is the authentic taste of 'Ubunyarwanda' hospitality.", avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Kabano_E", msg: "Isombe accompanied by plantains is heavenly!", avatar: "https://i.pravatar.cc/100?u=33" }
    ]
  },
  {
    id: "3",
    title: "Lakeside Tilapia Charcoal Grilling Secrets",
    category: "Grill / Fish",
    chefName: "Master Chef N. Karisa (NK)",
    chefTitle: "Lakeside Grill Specialist • Traditionalist",
    chefAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    viewersCount: 2850,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "9G_fC0p_O2s",
    description: "Prepare to learn the legendary lakeside fish grill Secrets! In this live stream, we prepare a fresh lake tilapia, scoring it deeply and stuffing with red onions, garlic leaves, tangawizi roots, celery and fiery pili-pili. We roast it slow over burning volcanic lava coals.",
    initialChats: [
      { user: "Dave R.", msg: "How do you prevent the skin from sticking to the grill?", avatar: "https://i.pravatar.cc/100?u=4" },
      { user: "Sarah J.", msg: "We need volcanic charcoals for that lake flavor!", avatar: "https://i.pravatar.cc/100?u=1" },
      { user: "Chef Karisa", msg: "The secret is clean, pre-heated metal grates and brushing with tangawizi-salt oil!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Lake Lover", msg: "Tilapia from Kirehe lake is the sweetest!", avatar: "https://i.pravatar.cc/100?u=21" },
      { user: "FoodieLi", msg: "Just ordered the Urwagwa beer to wash it down!", avatar: "https://i.pravatar.cc/100?u=3" },
    ],
    simulatedReplies: [
      { user: "Eric Rwa", msg: "Looks beautiful, the smoky bark is forming perfectly!", avatar: "https://i.pravatar.cc/100?u=14" },
      { user: "Chef Karisa", msg: "Exactly, that charcoal caramelized spice coat locks in all juice!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "FishLover99", msg: "Fasting day is over! Standard tilapia is ordered!", avatar: "https://i.pravatar.cc/100?u=22" },
      { user: "Muhire88", msg: "Is akabanga pepper oil applied at the end?", avatar: "https://i.pravatar.cc/100?u=13" },
      { user: "Chef Karisa", msg: "Absolutely, dynamic akabanga dropper at the table is king!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Mukamana_S", msg: "The lemon herb coating sizzle is so relaxing", avatar: "https://i.pravatar.cc/100?u=38" }
    ]
  },
  {
    id: "4",
    title: "Amandazi Sweet Cloud Baking Technique",
    category: "Dessert / Beignets",
    chefName: "Master Chef N. Karisa (NK)",
    chefTitle: "Patisserie Expert • Traditional Baker",
    chefAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    viewersCount: 1940,
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "T75qY80VPlg",
    description: "Join me in the traditional baker station today! We are whisking local yeast sweet beignets—known across Rwanda as 'Amandazi'. I will reveal secrets to airy pockets, elegant cardamom scent, and that rustic shatter upon taking your first bite.",
    initialChats: [
      { user: "Keza K.", msg: "Do you add cinnamon or just pure cardamom?", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Mike Chef", msg: "Mine never get that beautiful hollow pocket!", avatar: "https://i.pravatar.cc/100?u=2" },
      { user: "Chef Karisa", msg: "Welcome bake squad! Only use fresh cardamom and rest the dough for exactly 2 hours.", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "SweetTooth", msg: "Adding some local honey is absolute magic!", avatar: "https://i.pravatar.cc/100?u=25" },
      { user: "Gisa L.", msg: "They pair so well with ginger tangawizi tea!", avatar: "https://i.pravatar.cc/100?u=11" },
    ],
    simulatedReplies: [
      { user: "Clarisse_U", msg: "Can we bake them in an oven or must they be fried?", avatar: "https://i.pravatar.cc/100?u=26" },
      { user: "Chef Karisa", msg: "Traditional amandazi must be fried in fresh vegetable oil to puff properly, but baking yields great sweet cardamom buns!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Mike Chef", msg: "Doing dough prep now! Resting it on the window.", avatar: "https://i.pravatar.cc/100?u=2" },
      { user: "RwandaLover", msg: "I got a basket of amandazi, the cardamom flavour has high power!", avatar: "https://i.pravatar.cc/100?u=35" }
    ]
  }
];

const FRENCH_PRODUCTS: FoodItem[] = [
  {
    id: "french-butter-roll",
    name: "French Butter Roll",
    price: 3500,
    rating: 4.8,
    reviews: 95,
    deliveryTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500",
    category: "Dessert",
    description: "Delicate and sweet hand-folded French buttery crescent roll baked to golden crisp perfection.",
    chef: { name: "Chef Jean-Luc", avatar: "https://i.pravatar.cc/100?u=chef", quote: "Patience and quality butter behaves perfectly." }
  },
  {
    id: "organic-pastry-flour",
    name: "Organic Pastry Flour",
    price: 6500,
    rating: 4.9,
    reviews: 120,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=500",
    category: "Traditional",
    description: "Super-fine wheat flour milled to perfection, ideal for pastries, rolls, and cakes.",
    chef: { name: "Chef Jean-Luc", avatar: "https://i.pravatar.cc/100?u=chef", quote: "Fine flour holds the structure of delicate layered buttery buns." }
  }
];

const getStreamFeaturedProducts = (streamId: string): FoodItem[] => {
  if (streamId === "1") {
    return FRENCH_PRODUCTS;
  }
  if (streamId === "2") {
    return FOODS_DATA.filter(item => item.id === "isombe-rice" || item.id === "kirehe-avocado-salad");
  }
  if (streamId === "3") {
    return FOODS_DATA.filter(item => item.id === "grilled-tilapia" || item.id === "urwagwa-beer");
  }
  if (streamId === "4") {
    return FOODS_DATA.filter(item => item.id === "amandazi-beignets" || item.id === "african-ginger-tea");
  }
  return [];
};

interface HeartType {
  id: number;
  x: number;
  scale: number;
  color: string;
  emoji: string;
}

export function Streams() {
  const { user } = useAuth();
  const { addToCart, formatPrice } = useCart();

  const [activeStream, setActiveStream] = useState<StreamType>(STREAMS_LIST[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(STREAMS_LIST[0].initialChats);
  const [chatInput, setChatInput] = useState("");
  const [simulatedIndex, setSimulatedIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewerCount, setViewerCount] = useState(STREAMS_LIST[0].viewersCount);
  const [isMuted, setIsMuted] = useState(true);

  // State for floating hearts spawned dynamically
  const [hearts, setHearts] = useState<HeartType[]>([]);

  // Tab state for the professional live community sidebar: "chat" or "charts"
  const [activeTab, setActiveTab] = useState<"chat" | "charts">("chat");

  // Dynamic values representing real-time community engagement indices
  const [engagementScore, setEngagementScore] = useState<number>(85);
  const [messagesPerMinute, setMessagesPerMinute] = useState<number>(48);
  const [chartData, setChartData] = useState<number[]>([42, 55, 61, 58, 70, 78, 85]);
  const [sentimentHappy, setSentimentHappy] = useState<number>(92);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Synchronize viewer counts and chats when active stream changes
  useEffect(() => {
    setMessages(activeStream.initialChats);
    setSimulatedIndex(0);
    setViewerCount(activeStream.viewersCount);
    setIsLiked(false);
    setIsFollowing(false);
    
    // Reset/seed custom analytics parameters beautifully
    const baseEngagement = Math.floor(Math.random() * 20) + 75; // 75 - 95%
    setEngagementScore(baseEngagement);
    setMessagesPerMinute(Math.floor(Math.random() * 30) + 35); // 35 - 65 mpm
    setSentimentHappy(Math.floor(Math.random() * 6) + 93); // 93 - 99%
    setChartData([
      baseEngagement - 12, 
      baseEngagement - 8, 
      baseEngagement - 15, 
      baseEngagement - 5, 
      baseEngagement - 2, 
      baseEngagement
    ]);
  }, [activeStream]);

  // Smooth auto-scrolling for chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate viewer fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setViewerCount(prev => prev + (Math.random() > 0.5 ? Math.floor(Math.random() * 6) + 1 : -(Math.floor(Math.random() * 6) + 1)));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Highly professional Engagement graph fluctuation loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Modify active engagement and messages per minute metric live
      setEngagementScore(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const bounded = Math.max(60, Math.min(100, prev + delta));
        
        // Push to SVG array
        setChartData(prevData => {
          const updated = [...prevData.slice(1), bounded];
          return updated;
        });
        
        return bounded;
      });

      setMessagesPerMinute(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(120, prev + delta));
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // Spawns premium particles above video viewport
  const triggerFloatParticle = (iconType: "heart" | "fire" | "smile") => {
    const emojis = {
      heart: "❤️",
      fire: "🔥",
      smile: "🤤"
    };

    const colors = {
      heart: "#f43f5e",
      fire: "#f97316",
      smile: "#eab308"
    };

    const newHeart: HeartType = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // random offset percent
      scale: Math.random() * 0.4 + 0.8,
      color: colors[iconType],
      emoji: emojis[iconType]
    };

    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(item => item.id !== newHeart.id));
    }, 2500);
  };

  // Simulating live active commentary periodically in infinite loop
  useEffect(() => {
    const replies = activeStream.simulatedReplies || [];
    if (replies.length === 0) return;

    const interval = setInterval(() => {
      setSimulatedIndex(prevIdx => {
        const nextIdx = prevIdx % replies.length;
        const incomingComment = replies[nextIdx];
        
        if (incomingComment) {
          setMessages(prev => [...prev, incomingComment]);
          
          // Trigger cute matching heart or smile animation to feel live and authentic
          const text = incomingComment.msg.toLowerCase();
          if (text.includes("love") || text.includes("beautiful") || text.includes("perfect")) {
            triggerFloatParticle("heart");
          } else if (text.includes("smell") || text.includes("delicious") || text.includes("taste")) {
            triggerFloatParticle("smile");
          } else if (text.includes("charcoal") || text.includes("hot") || text.includes("oven")) {
            triggerFloatParticle("fire");
          }
        }
        
        return prevIdx + 1;
      });
    }, 8000); // Live commentary updates every 8 seconds

    return () => clearInterval(interval);
  }, [activeStream]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const username = user?.displayName || user?.email?.split("@")[0] || "Kirehe_Foodie";
    const userMessage: ChatMessage = {
      user: username,
      msg: chatInput.trim(),
      avatar: user?.photoURL || `https://i.pravatar.cc/100?u=${encodeURIComponent(username)}`,
    };

    setMessages(prev => [...prev, userMessage]);
    const originalText = chatInput;
    setChatInput("");

    // Float beautiful symbol immediately on your send
    triggerFloatParticle("heart");

    // Recalculate and trigger simulated replies based on sent content
    setTimeout(() => {
      const hostGreetings = [
        `Thanks for joining, @${userMessage.user}! That is exactly what we strive for in Rwanda!`,
        `Amazing observation, @${userMessage.user}! Let me show you that step again inside Kirehe kitchen.`,
        `Exactly @${userMessage.user}! Make sure to order the active local ingredients on the right, delivered in minutes!`,
        `Greetings @${userMessage.user}! Very glad you are enjoying our FoodNet live community feed.`,
        `Yes @${userMessage.user}! That heat factor guarantees peak tenderness values!`
      ];
      const randomGreeting = hostGreetings[Math.floor(Math.random() * hostGreetings.length)];
      
      setMessages(prev => [
        ...prev,
        {
          user: activeStream.chefName,
          msg: randomGreeting,
          avatar: activeStream.chefAvatar,
          isChef: true,
        }
      ]);

      // Pop response flame
      triggerFloatParticle("fire");
    }, 2200);
  };

  const handleAddToCart = (product: FoodItem) => {
    addToCart(product, 1);
  };

  // Convert points array to standard SVG path coordinates
  const getLinePath = () => {
    const width = 280;
    const height = 80;
    const padding = 10;
    const pointsCount = chartData.length;
    if (pointsCount < 2) return "";
    
    return chartData.map((val, idx) => {
      const x = padding + (idx / (pointsCount - 1)) * (width - 2 * padding);
      // Map min/max score
      const y = height - padding - ((val - 50) / 50) * (height - 2 * padding);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Banner Alert / Breadcrumb */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between bg-orange-600 text-white rounded-[1.8rem] px-8 py-5 shadow-xl shadow-orange-600/10 gap-4">
          <div className="flex items-center gap-3">
            <Radio className="animate-pulse" size={18} />
            <span className="text-xs font-black uppercase tracking-widest leading-none">FOODNET LIVE BROADCASTS</span>
          </div>
          <span className="text-[10px] md:text-xs font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-center">
            Broadcasting delicious masterclasses straight from Kirehe lake &amp; organic cooperatives
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Stream Area */}
          <div className="lg:w-2/3 space-y-8 animate-fadeIn">
            
            {/* YouTube Active Stream Container */}
            <div className="relative aspect-video bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
              
              {/* Actual YouTube Embed Iframe or Static Poster Mode */}
              {isPlaying && activeStream.youtubeId ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <iframe
                    title={activeStream.title}
                    className="w-full h-full relative z-10"
                    src={`https://www.youtube.com/embed/${activeStream.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1&controls=1&showinfo=0`}
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10"></div>
              )}

              {/* Offline Overlay if user paused */}
              {!isPlaying && (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md z-20 text-white p-6 text-center">
                  <div className="w-20 h-20 bg-orange-600 hover:bg-orange-700 backdrop-blur-xl rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-600/40 border-4 border-white transition-all hover:scale-105 cursor-pointer mb-4" onClick={() => setIsPlaying(true)}>
                    <Play size={36} fill="currentColor" className="ml-1.5" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Live Stream Standing By</h3>
                  <p className="text-xs text-gray-300 max-w-sm font-semibold">Click play to resume live culinary stream broadcasting natively via YouTube high-speed channels.</p>
                </div>
              )}

              {/* Rising Floating Emojis / Hearts Channel Layer */}
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                <AnimatePresence>
                  {hearts.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, y: "100%", x: `${h.x}%`, scale: 0.3 }}
                      animate={{ 
                        opacity: [0, 1, 0.9, 0], 
                        y: ["100%", "20%", "5%"],
                        x: [`${h.x}%`, `${h.x + (Math.random() * 16 - 8)}%`, `${h.x + (Math.random() * 32 - 16)}%`],
                        scale: h.scale
                      }}
                      transition={{ duration: 2.2, ease: "easeOut" }}
                      className="absolute bottom-4 text-3xl select-none"
                    >
                      {h.emoji}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* LIVE feed indicators */}
              <div className="absolute top-6 left-6 flex gap-3 z-20">
                <div className="bg-red-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-lg uppercase tracking-widest select-none">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping shrink-0" />
                  LIVE
                </div>
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-extrabold text-xs select-none">
                  <Users size={14} className="text-orange-500" />
                  <span>{viewerCount.toLocaleString()} Viewers</span>
                </div>
              </div>

              {/* Controls Overlay Button (Mute indicator & Info) */}
              <div className="absolute top-6 right-6 z-20 flex gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/60 hover:bg-black/85 backdrop-blur-md text-white w-10 h-10 rounded-2xl flex items-center justify-center transition-all border border-white/10"
                  title={isMuted ? "Unmute stream audio" : "Mute stream audio"}
                >
                  {isMuted ? <VolumeX size={16} className="text-gray-300" /> : <Volume2 size={16} className="text-orange-400" />}
                </button>
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl flex items-center gap-1.5 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>YouTube Stream</span>
                </div>
              </div>

              {/* Interactive Interaction Trigger Overlay Overlay inside Video Bottom-Right */}
              <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-white">
                <span className="text-[10px] uppercase font-black tracking-wider pl-2 pr-1 text-gray-300">Interact:</span>
                <button 
                  onClick={() => triggerFloatParticle("heart")} 
                  className="w-8 h-8 rounded-xl bg-orange-600/80 hover:bg-orange-600 flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-all"
                  title="Send Heart"
                >
                  ❤️
                </button>
                <button 
                  onClick={() => triggerFloatParticle("fire")} 
                  className="w-8 h-8 rounded-xl bg-orange-600/80 hover:bg-orange-600 flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-all"
                  title="Send Flame"
                >
                  🔥
                </button>
                <button 
                  onClick={() => triggerFloatParticle("smile")} 
                  className="w-8 h-8 rounded-xl bg-orange-600/80 hover:bg-orange-600 flex items-center justify-center text-xs hover:scale-105 active:scale-95 transition-all"
                  title="Send Mmmm"
                >
                  🤤
                </button>
              </div>

            </div>

            {/* Header / Host detail area below stream */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black tracking-widest text-orange-600 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-xl uppercase inline-block">
                  {activeStream.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-gray-900">{activeStream.title}</h1>
                <div className="flex items-center gap-3 pt-1">
                  <img 
                    src={activeStream.chefAvatar} 
                    className="w-12 h-12 rounded-2xl border border-gray-100 object-cover shadow-sm" 
                    alt="Active Chef Host" 
                  />
                  <div>
                    <h4 className="text-sm font-black text-gray-900 leading-snug">{activeStream.chefName}</h4>
                    <p className="text-[11px] text-gray-400 font-bold">{activeStream.chefTitle}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 shrink-0 self-start md:self-center">
                <button 
                  onClick={() => {
                    setIsLiked(!isLiked);
                    triggerFloatParticle("heart");
                    if (!isLiked) {
                      toast.success("Added to your Liked Masterclasses!");
                    }
                  }}
                  className={`px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 border font-bold text-xs transition-all active:scale-95 ${
                    isLiked 
                      ? 'bg-red-50 border-red-200 text-red-600 shadow-md shadow-red-100/50' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-transparent'
                  }`}
                >
                  <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                  <span>{isLiked ? "Liked!" : "Love"}</span>
                </button>
                <button 
                  onClick={() => {
                    setIsFollowing(!isFollowing);
                    if (!isFollowing) {
                      triggerFloatParticle("smile");
                    }
                    toast.success(isFollowing ? "Unfollowed cooking reminders." : `Subscribed to ${activeStream.chefName} broadcasts!`);
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 ${
                    isFollowing 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/10' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/10'
                  }`}
                >
                  {isFollowing ? "✓ Subscribed" : "Subscribe"}
                </button>
              </div>
            </div>

            {/* About Stream Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-100 flex flex-col space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-orange-500" size={24} />
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">About this Stream</h2>
              </div>
              <p className="text-gray-500 font-semibold leading-relaxed">
                {activeStream.description}
              </p>
              
              {/* Dynamic products mapped to the active stream details */}
              <div className="border-t border-gray-100 pt-8 space-y-4">
                <h3 className="font-extrabold text-gray-900 text-base uppercase tracking-wider text-orange-600">
                  🛒 Featured Ingredients in Broadcast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {getStreamFeaturedProducts(activeStream.id).map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-gray-50/50 hover:bg-gray-50 rounded-[2rem] p-5 flex items-center gap-5 border border-gray-100 transition-all hover:border-orange-100/60 group"
                    >
                      <img 
                        src={product.image} 
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0 group-hover:scale-105 transition-transform" 
                        alt={product.name} 
                      />
                      <div className="space-y-1.5 flex-grow min-w-0">
                        <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest">{product.category}</span>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-orange-600 font-extrabold text-xs">{formatPrice(product.price)}</p>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <p className="text-[10px] text-gray-400 font-extrabold">{product.deliveryTime} delivery</p>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="text-[11px] bg-orange-600 text-white px-3.5 py-1.5 rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-orange-100/50 mt-1"
                        >
                          <ShoppingBag size={11} />
                          Add to order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat & Dynamic Analytics Charts Column */}
          <div className="lg:w-1/3 flex flex-col justify-between">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/40 h-[720px] flex flex-col overflow-hidden border border-gray-100 sticky top-28">
              
              {/* Professional Tabs Header: Chat vs Dynamic Statistics Chart */}
              <div className="p-2 bg-gray-100/60 shrink-0 border-b border-gray-100 flex gap-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === "chat"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-white/40"
                  }`}
                >
                  <MessageSquare size={14} />
                  <span>Interactive Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab("charts")}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === "charts"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-white/40"
                  }`}
                >
                  <Activity size={14} className="animate-pulse" />
                  <span>Engagement Chart</span>
                </button>
              </div>

              {/* TAB CONTENT: Chat Feed */}
              {activeTab === "chat" ? (
                <>
                  {/* Message scroll container */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/25">
                    <div className="text-center py-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5">
                        📢 Live Feed Active: Respect and culinary passion
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages.map((chat, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2.5 text-xs"
                        >
                          <img 
                            src={chat.avatar} 
                            className="w-9 h-9 rounded-2xl object-cover border border-gray-100 shrink-0 shadow-sm" 
                            alt="Profile avatar" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?u=${idx}`;
                            }}
                          />
                          <div className="flex-grow min-w-0">
                            <div className={`p-4 rounded-2xl ${
                              chat.isChef 
                                ? 'bg-orange-50 border border-orange-200/50 shadow-sm' 
                                : 'bg-white border border-gray-100/70 shadow-sm'
                            }`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`font-black tracking-tight shrink-0 truncate max-w-[120px] ${
                                  chat.isChef ? 'text-orange-600' : 'text-gray-900'
                                }`}>
                                  {chat.user}
                                </span>
                                {chat.isChef && (
                                  <span className="bg-orange-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                                    Host • Chef
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs leading-relaxed font-semibold break-words ${
                                chat.isChef ? 'text-orange-900 font-bold' : 'text-gray-600'
                              }`}>
                                {chat.msg}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Send Input Box */}
                  <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-100/50">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Say hello or ask recipe questions..." 
                        className="flex-grow bg-transparent px-3 py-2 outline-none font-bold text-xs text-gray-800 placeholder:text-gray-400"
                      />
                      <button 
                        type="submit"
                        className="bg-orange-600 text-white p-2.5 rounded-xl hover:bg-orange-700 transition-all shadow-md shadow-orange-600/10 active:scale-95 shrink-0"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                /* TAB CONTENT: Analytical Engagement & Community Chart */
                <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-950 text-white flex flex-col justify-between">
                  
                  {/* Header Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="text-orange-500 animate-pulse" size={18} />
                      <h4 className="text-xs uppercase font-black text-gray-400 tracking-widest">Real-time engagement telemetry</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Engagement Intensity</span>
                        <div className="flex items-baseline gap-1.5 mt-2">
                          <span className="text-2xl font-black text-orange-400">{engagementScore}%</span>
                          <TrendingUp className="text-green-500" size={14} />
                        </div>
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Excellent Score</span>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Chat Velocity</span>
                        <div className="flex items-baseline gap-1.5 mt-2">
                          <span className="text-2xl font-black text-white">{messagesPerMinute}</span>
                          <span className="text-[10px] text-gray-400 font-extrabold">msg/min</span>
                        </div>
                        <span className="text-[9px] font-semibold text-orange-500 mt-1">High Velocity</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Live Graphic Plotting Engagement over Seconds */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-3xl space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Interactive Excitement timeline</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
                        LIVE UPDATE
                      </span>
                    </div>

                    {/* SVG Chart Frame */}
                    <div className="relative h-24 flex items-end justify-center pt-2">
                      <svg className="w-full h-full overflow-visible">
                        <defs>
                          <g id="grid-lines">
                            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                            <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                          </g>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Render Grid */}
                        <use href="#grid-lines" />

                        {/* Stroke Path */}
                        <path 
                          d={getLinePath()} 
                          fill="none" 
                          stroke="#f97316" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-all duration-700 ease-in-out" 
                        />
                        
                        {/* Underlay Gradient */}
                        <path 
                          d={`${getLinePath()} L 270 80 L 10 80 Z`} 
                          fill="url(#chart-grad)"
                          className="transition-all duration-700 ease-in-out" 
                        />

                        {/* Pulsating last plot point shadow */}
                        {chartData.length > 0 && (
                          <circle 
                            cx={10 + ((chartData.length - 1) / (chartData.length - 1)) * 260} 
                            cy={80 - 10 - ((chartData[chartData.length - 1] - 50) / 50) * 60} 
                            r="5" 
                            fill="#f97316" 
                            className="animate-ping" 
                          />
                        )}
                      </svg>
                    </div>

                    <div className="flex justify-between text-[8px] text-gray-500 font-extrabold">
                      <span>30s ago</span>
                      <span>15s ago</span>
                      <span>Now</span>
                    </div>
                  </div>

                  {/* Crowd Sentiment and Reaction percentages */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Audience Sentiment Analysis</span>
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5"><Smile size={12} className="text-yellow-400" /> Inspired &amp; Hungry</span>
                          <span>{sentimentHappy}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-orange-500 h-full rounded-full" 
                            animate={{ width: `${sentimentHappy}%` }} 
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5"><Flame size={12} className="text-red-500" /> Interactive Love</span>
                          <span>{100 - sentimentHappy}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-red-500 h-full rounded-full" 
                            animate={{ width: `${100 - sentimentHappy}%` }} 
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard panel representation to feel real */}
                  <div className="bg-white/5 p-4 rounded-2xl space-y-3.5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <Award className="text-yellow-500" size={14} />
                      <span className="text-[10px] font-black uppercase text-gray-300 tracking-wider">Top Stream Chat Supporters</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "Sarah J.", commentsCount: "12 remarks", rating: "VIP Patron" },
                        { name: "Kirehe_Foodie", commentsCount: "8 remarks", rating: "Culinary Fanatic" },
                        { name: "Mike Chef", commentsCount: "6 remarks", rating: "Baking Resident" }
                      ].map((lead, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-500">{i + 1}.</span>
                            <span className="font-extrabold text-gray-200">{lead.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-orange-400 font-bold">{lead.rating}</p>
                            <p className="text-[8px] text-gray-400 font-extrabold">{lead.commentsCount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-gray-500 text-center font-bold">
                    Telemetry calculates chat speed, floating reactions, and viewer activity metrics natively.
                  </p>

                </div>
              )}

            </div>
            
            {/* Other Live Now Streams List */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Radio className="text-red-500 animate-pulse" size={16} />
                <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest pl-1">Other Live Broadcasting Channels</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {STREAMS_LIST.map((ls) => {
                  const isActive = ls.id === activeStream.id;
                  return (
                    <div 
                      key={ ls.id } 
                      onClick={() => {
                        setActiveStream(ls);
                        setIsPlaying(true);
                      }}
                      className={`p-3.5 rounded-[2rem] hover:shadow-lg transition-all flex gap-4 cursor-pointer border group active:scale-[0.98] ${
                        isActive 
                          ? 'bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-600/10' 
                          : 'bg-white text-gray-900 border-gray-100 hover:border-orange-200'
                      }`}
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                        <img 
                          src={ls.image} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt="Sidebar Thumbnail" 
                        />
                        <div className="absolute inset-0 bg-black/25"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={14} fill="white" className="text-white" />
                        </div>
                      </div>
                      
                      <div className="py-1 flex flex-col justify-between overflow-hidden">
                        <div>
                          <span className={`text-[8px] font-black uppercase tracking-widest block mb-0.5 ${
                            isActive ? 'text-orange-200' : 'text-orange-600'
                          }`}>
                            {ls.category}
                          </span>
                          <h4 className="font-extrabold text-xs line-clamp-1 leading-snug">
                            {ls.title}
                          </h4>
                          <p className={`text-[10px] mt-0.5 font-bold ${
                            isActive ? 'text-orange-100' : 'text-gray-400'
                          }`}>
                            {ls.chefName}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[9px] font-black mt-1.5 uppercase tracking-wider">
                          <Users size={12} className={isActive ? "text-orange-200" : "text-red-400"} />
                          <span>{isActive ? viewerCount.toLocaleString() : ls.viewersCount.toLocaleString()} Live</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
