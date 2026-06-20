import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Heart, Share2, Users, Send, CheckCircle2, ShoppingBag, 
  Radio, Sparkles, MessageSquare, Flame, Smile, TrendingUp, 
  BarChart3, Activity, Award, Volume2, VolumeX, AlertCircle, RefreshCw,
  Tv, Settings, Link2, Save
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../components/AuthContext";
import { useCart } from "../components/CartContext";
import { FOODS_DATA, FoodItem } from "../data/foods";
import { toast } from "react-hot-toast";
import { SEO } from "../components/SEO";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
    id: "foodnet-live",
    title: "FoodNet Official Live Kitchen Channel",
    category: "Rwandan / Live",
    chefName: "Chef NK & Guests",
    chefTitle: "FoodNet Culinary Broadcaster Team",
    chefAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    viewersCount: 2420,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "UCjQipHS6TmgpwbkdBK68QWQ",
    description: "Welcome to Kirehe kitchen's official live cooking channel! This stream integrates directly with our YouTube Live account (Channel ID: UCjQipHS6TmgpwbkdBK68QWQ, @FoodNet-v4o). When we go live to cook traditional delicacies, the stream activates here instantly!",
    initialChats: [
      { user: "Keza K.", msg: "Wow, is the kitchen live right now?", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Gisa L.", msg: "Amazing! YouTube Live integration is so clean on FoodNet!", avatar: "https://i.pravatar.cc/100?u=11" },
      { user: "Chef Karisa", msg: "Hello community! Yes, whenever we go live on YouTube, this player streams instantly!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
    ],
    simulatedReplies: [
      { user: "Sarah J.", msg: "I love cooking along with you!", avatar: "https://i.pravatar.cc/100?u=1" },
      { user: "Muhire88", msg: "Just subscribed on YouTube to @FoodNet-v4o!", avatar: "https://i.pravatar.cc/100?u=13" },
      { user: "Eric Rwa", msg: "The Tilapia grill technique is awesome!", avatar: "https://i.pravatar.cc/100?u=14" }
    ]
  },
  {
    id: "1",
    title: "The Art of Baking Sweet Rwandan Honey-millet cake",
    category: "Bakery / Dessert",
    chefName: "Master Chef N. Karisa (NK)",
    chefTitle: "Executive Master Chef of FoodNet",
    chefAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    viewersCount: 3452,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "beOzS__-XpA",
    description: "Today we are diving into the complex art of traditional Rwandan baking. Join me as I show you how to construct the perfect, delicate Umutsima w’Uburo (Millet Cake) sweetened with premium Kirehe wild forest honey! Feel free to order the featured ingredients directly from the side menu.",
    initialChats: [
      { user: "Sarah J.", msg: "Does the butter need to be room temp?", avatar: "https://i.pravatar.cc/100?u=1" },
      { user: "Mike Chef", msg: "Wow, it looks so fluffy already!", avatar: "https://i.pravatar.cc/100?u=2" },
      { user: "FoodieLi", msg: "Just ordered the flour to follow along!", avatar: "https://i.pravatar.cc/100?u=3" },
      { user: "Chef Karisa", msg: "Welcome everyone! Yes, room temp organic butter is best.", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Dave R.", msg: "Can't wait to taste this!", avatar: "https://i.pravatar.cc/100?u=4" },
    ],
    simulatedReplies: [
      { user: "Clara M.", msg: "Mine is in the oven right now!", avatar: "https://i.pravatar.cc/100?u=6" },
      { user: "BakingGeek", msg: "Chef, does salted butter make a difference?", avatar: "https://i.pravatar.cc/100?u=7" },
      { user: "Chef Karisa", msg: "Unsalted is preferred so you can fully control the salt balance!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Alex_P", msg: "Beautiful rich texture!", avatar: "https://i.pravatar.cc/100?u=8" },
      { user: "FoodieLi", msg: "Oh, it's getting brown! Delicious!", avatar: "https://i.pravatar.cc/100?u=3" },
      { user: "RwandanPastry", msg: "Can you make these with sweet maize flour?", avatar: "https://i.pravatar.cc/100?u=10" },
      { user: "Chef Karisa", msg: "Millet or sorghum provides the authentic color and sweet molasses undertones!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Jeanne_D", msg: "Smells like a premium bakery in Kirehe!", avatar: "https://i.pravatar.cc/100?u=18" }
    ]
  },
  {
    id: "2",
    title: "Traditional Rwandan Isombe Masterclass",
    category: "Rwandan / Cassava",
    chefName: "Master Chef N. Karisa (NK)",
    chefTitle: "Executive Master Chef of FoodNet",
    chefAvatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200",
    viewersCount: 4120,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400",
    videoPoster: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200",
    youtubeId: "W6kZ8uG6608",
    description: "Welcome to Kirehe's culinary soul! Today, we are mastering traditional Rwandan Isombe—pounded cassava leaves cooked meticulously with pure peanut paste, fresh palm oil, and organic garden leeks. I will show you how we achieve the legendary peak tenderness from lakeside organic crops.",
    initialChats: [
      { user: "Gisa L.", msg: "Pounding cassava leaves by hand looks intense! Is there a food prep shortcut?", avatar: "https://i.pravatar.cc/100?u=11" },
      { user: "Keza K.", msg: "Oh, I love Kirehe honey! Will we use pure palm oil too?", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Chef Karisa", msg: "Welcome guys! Yes, traditional palm oil or sunflower oil is perfect. Pounding develops the true herbal aroma!", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Muhire88", msg: "Ordered Isombe to follow along! Can't wait!", avatar: "https://i.pravatar.cc/100?u=13" },
      { user: "Eric Rwa", msg: "This smell is incredible, Kirehe's finest!", avatar: "https://i.pravatar.cc/100?u=14" },
    ],
    simulatedReplies: [
      { user: "Nshuti_P", msg: "Wow, is peak simmer time 3 or 4 hours?", avatar: "https://i.pravatar.cc/100?u=15" },
      { user: "Chef Karisa", msg: "The longer the better! At least 2.5 hours on a gentle volcanic charcoal flame to break down fibres.", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
      { user: "Keza K.", msg: "Just added the Isombe to my cart, delivery is in less than 25 minutes! Kirehe courier is fast!", avatar: "https://i.pravatar.cc/100?u=12" },
      { user: "Umutoni_F", msg: "Smells like grandmother's village kitchen!", avatar: "https://i.pravatar.cc/100?u=16" },
      { user: "Chef Karisa", msg: "Exactly, Umutoni! That is the authentic taste of 'Ubunyarwanda' hospitality.", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", isChef: true },
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
    chef: { name: "Master Chef N. Karisa (NK)", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", quote: "Traditional baking blended with modern finesse." }
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
    chef: { name: "Master Chef N. Karisa (NK)", avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200", quote: "Healthy and robust flour holds structure perfectly." }
  }
];

const getStreamFeaturedProducts = (streamId: string): FoodItem[] => {
  if (streamId === "foodnet-live" || !streamId) {
    return FOODS_DATA.filter(item => item.id === "isombe-rice" || item.id === "amandazi-beignets" || item.id === "grilled-tilapia");
  }
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
  const { user, isAdmin, userData } = useAuth();
  const { addToCart, formatPrice } = useCart();

  const isChef = userData?.role === "chef" || userData?.role === "admin" || isAdmin || (user?.email === "maraphone14@gmail.com" || user?.email === "joshua@foodnet.rw");

  const [streamsList, setStreamsList] = useState<StreamType[]>(STREAMS_LIST);
  const [activeStream, setActiveStream] = useState<StreamType>(STREAMS_LIST[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(STREAMS_LIST[0].initialChats);
  const [chatInput, setChatInput] = useState("");
  const [simulatedIndex, setSimulatedIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewerCount, setViewerCount] = useState(STREAMS_LIST[0].viewersCount);
  const [isMuted, setIsMuted] = useState(true);

  // Broadcaster state hooks
  const [showBroadcasterPanel, setShowBroadcasterPanel] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardYoutubeId, setBoardYoutubeId] = useState("");
  const [boardCategory, setBoardCategory] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [selectedStreamToEdit, setSelectedStreamToEdit] = useState<string>("foodnet-live");

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

  // 1. Live subscribe to Firestore '/livestreams' collection
  useEffect(() => {
    const q = collection(db, "livestreams");
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seeding initial stream list so they exist in DB
        try {
          for (const s of STREAMS_LIST) {
            await setDoc(doc(db, "livestreams", s.id), {
              id: s.id,
              title: s.title,
              category: s.category,
              chefName: s.chefName,
              chefTitle: s.chefTitle,
              chefAvatar: s.chefAvatar,
              viewersCount: s.viewersCount,
              image: s.image,
              videoPoster: s.videoPoster,
              youtubeId: s.youtubeId,
              description: s.description,
              initialChats: s.initialChats,
              simulatedReplies: s.simulatedReplies
            });
          }
        } catch (err) {
          console.error("Error seeding livestreams in onSnapshot:", err);
        }
      } else {
        const list: StreamType[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as StreamType);
        });
        
        // Sort streams list nicely: put foodnet-live first, then sorted by ID
        list.sort((a, b) => {
          if (a.id === "foodnet-live") return -1;
          if (b.id === "foodnet-live") return 1;
          return a.id.localeCompare(b.id);
        });
        
        setStreamsList(list);

        // Synchronize activeStream in real-time if its content was updated in the DB
        setActiveStream(prev => {
          const matched = list.find(s => s.id === prev.id);
          return matched || prev;
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "livestreams");
    });

    return () => unsubscribe();
  }, []);

  // 2. Pre-populate broadcaster panel input form when selection changes
  useEffect(() => {
    const streamToEdit = streamsList.find(s => s.id === selectedStreamToEdit);
    if (streamToEdit) {
      setBoardTitle(streamToEdit.title);
      setBoardYoutubeId(streamToEdit.youtubeId);
      setBoardCategory(streamToEdit.category);
      setBoardDesc(streamToEdit.description);
    }
  }, [selectedStreamToEdit, streamsList, showBroadcasterPanel]);

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

  // Save configured stream details to Firestore
  const handleSaveStreamConfig = async () => {
    if (!boardTitle.trim() || !boardYoutubeId.trim() || !boardCategory.trim()) {
      toast.error("Please fill out Title, Video/Channel ID, and Category.");
      return;
    }
    const tid = toast.loading("Saving stream configurations to Firestore...");
    try {
      const docRef = doc(db, "livestreams", selectedStreamToEdit);
      await updateDoc(docRef, {
        title: boardTitle.trim(),
        youtubeId: boardYoutubeId.trim(),
        category: boardCategory.trim(),
        description: boardDesc.trim()
      });
      toast.success("Broadcasting feed updated in cloud Firestore!", { id: tid });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update broadcast settings. Please verify permissions.", { id: tid });
    }
  };

  // Smart Youtube Video/Channel Embed Parser
  const getIframeSrc = (youtubeId: string) => {
    if (!youtubeId) return "";
    
    const mutedParam = isMuted ? 1 : 0;

    // Check if it's a channel ID (starts with UC or is a 24-character string starting with UC)
    if (youtubeId.startsWith("UC") || (youtubeId.length === 24 && youtubeId.startsWith("UC"))) {
      return `https://www.youtube.com/embed/live_stream?channel=${youtubeId}&autoplay=1&mute=${mutedParam}&enablejsapi=1&rel=0&modestbranding=1&controls=1`;
    }
    
    // If it's a full YouTube URL, extract video id
    if (youtubeId.includes("youtube.com") || youtubeId.includes("youtu.be")) {
      let extractedId = "";
      try {
        if (youtubeId.includes("v=")) {
          extractedId = youtubeId.split("v=")[1]?.split("&")[0] || "";
        } else if (youtubeId.includes("embed/")) {
          extractedId = youtubeId.split("embed/")[1]?.split("?")[0] || "";
        } else if (youtubeId.includes("youtu.be/")) {
          extractedId = youtubeId.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (youtubeId.includes("live/")) {
          extractedId = youtubeId.split("live/")[1]?.split("?")[0] || "";
        }
      } catch (e) {
        console.error("Error parsing youtube URL", e);
      }
      if (extractedId) {
        return `https://www.youtube.com/embed/${extractedId}?autoplay=1&mute=${mutedParam}&enablejsapi=1&rel=0&modestbranding=1&controls=1`;
      }
    }
    
    // Standard video ID
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${mutedParam}&enablejsapi=1&rel=0&modestbranding=1&controls=1`;
  };

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
      <SEO 
        title="Live Culinary Masterclasses | FoodNet" 
        description="Watch elite Rwandan chefs prepare traditional cakes, Isombe, Akabenz, and delicacies live! Interact in real-time and order listed ingredients directly."
      />
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

            {/* Chef Broadcast Control Panel */}
            {isChef && (
              <div className="bg-slate-900 border-2 border-orange-500 rounded-[2.5rem] p-6 shadow-xl text-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Radio className="text-red-500 animate-pulse" size={24} />
                    <div>
                      <h3 className="font-extrabold text-white text-base">Chef Live Broadcast Deck</h3>
                      <p className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">Active Live Feed Synced to Cloud Firestore</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBroadcasterPanel(!showBroadcasterPanel)}
                    className="bg-orange-600 hover:bg-orange-700 font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all text-white self-start sm:self-center"
                  >
                    <Settings size={13} />
                    {showBroadcasterPanel ? "Hide Deck Builder" : "Configure Stream"}
                  </button>
                </div>

                {showBroadcasterPanel && (
                  <div className="pt-2 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Select Channel to Broadcast Or Update</label>
                        <select 
                          value={selectedStreamToEdit}
                          onChange={(e) => setSelectedStreamToEdit(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                        >
                          {streamsList.map((st) => (
                            <option key={st.id} value={st.id}>{st.title} ({st.category})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">YouTube URL / Channel ID / Video ID</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={boardYoutubeId} 
                            onChange={(e) => setBoardYoutubeId(e.target.value)}
                            placeholder="Paste Channel ID or Video link..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs font-mono"
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              setBoardYoutubeId("UCjQipHS6TmgpwbkdBK68QWQ");
                              toast.success("Loaded Verified Channel ID!");
                            }}
                            className="bg-black/40 hover:bg-black/60 text-[10px] font-bold text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-xl whitespace-nowrap active:scale-[0.98] transition-all"
                          >
                            Use Default Channel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stream Title</label>
                        <input 
                          type="text" 
                          value={boardTitle} 
                          onChange={(e) => setBoardTitle(e.target.value)}
                          placeholder="e.g. Traditional Cooking Masterclass"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                        <input 
                          type="text" 
                          value={boardCategory} 
                          onChange={(e) => setBoardCategory(e.target.value)}
                          placeholder="e.g. Rwandan / Traditional"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stream Description</label>
                      <textarea 
                        value={boardDesc} 
                        onChange={(e) => setBoardDesc(e.target.value)}
                        placeholder="Provide details about what you're cooking..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                      <div className="flex gap-2">
                        <a 
                          href="https://studio.youtube.com/channel/UCjQipHS6TmgpwbkdBK68QWQ/livestreaming" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5"
                        >
                          <Tv size={11} />
                          YouTube Creator Live Studio Portal
                        </a>
                      </div>
                      
                      <button 
                        onClick={handleSaveStreamConfig}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all active:scale-95"
                      >
                        <Save size={13} />
                        Go Live &amp; Update Stream Feed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* YouTube Active Stream Container */}
            <div className="relative aspect-video bg-gray-950 rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
              
              {/* Actual YouTube Embed Iframe or Static Poster Mode */}
              {isPlaying && activeStream.youtubeId ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <iframe
                    title={activeStream.title}
                    className="w-full h-full relative z-10"
                    src={getIframeSrc(activeStream.youtubeId)}
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

            {/* YouTube Channel Integration Card */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-red-900/10 border-4 border-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
                <svg className="w-64 h-64 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.516 3.545 12 3.545 12 3.545s-7.516 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11c-.51 1.871-.51 5.776-.51 5.776s0 3.905.51 5.776a3.003 3.003 0 0 0 2.11 2.11c1.872.508 9.388.508 9.388.508s7.516 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.51-1.871.51-5.776.51-5.776s0-3.905-.51-5.776zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              
              <div className="space-y-3 relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                    Broadcasting Station
                  </span>
                  <span className="bg-red-500/50 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-400/20">
                    Verified Channel
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase">Culinary Theater</h3>
                <p className="text-red-100 text-xs font-semibold leading-relaxed max-w-lg">
                  Join our official YouTube cooking community. Get notified of every traditional masterclass, street food review, and cooperative highlight stream from Lake Kirehe.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <div className="bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex flex-col">
                    <span className="text-[9px] uppercase font-black tracking-wider text-red-200">YouTube Channel ID</span>
                    <span className="font-mono text-xs font-extrabold text-white tracking-wider selection:bg-orange-500">
                      UCjQipHS6TmgpwbkdBK68QWQ
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex flex-col">
                    <span className="text-[9px] uppercase font-black tracking-wider text-red-200">Official Handle</span>
                    <span className="text-xs font-bold text-white leading-normal">@FoodNet-v4o</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto relative z-10 text-xs">
                <a 
                  href="https://www.youtube.com/@FoodNet-v4o" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-red-600 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-center shadow-lg hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.516 3.545 12 3.545 12 3.545s-7.516 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11c-.51 1.871-.51 5.776-.51 5.776s0 3.905.51 5.776a3.003 3.003 0 0 0 2.11 2.11c1.872.508 9.388.508 9.388.508s7.516 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.51-1.871.51-5.776.51-5.776s0-3.905-.51-5.776zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Subscribe on YouTube
                </a>
                <a 
                  href="https://studio.youtube.com/channel/UCjQipHS6TmgpwbkdBK68QWQ/livestreaming" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-center shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Radio size={14} className="animate-pulse" />
                  YouTube Live Control Room
                </a>
                <a 
                  href="https://www.youtube.com/channel/UCjQipHS6TmgpwbkdBK68QWQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-800/40 hover:bg-red-800/60 text-white border border-red-500/20 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2"
                >
                  Visit Channel Portal
                </a>
              </div>
            </div>
          </div>
          {/* Dynamic Analytics Charts Column */}
          <div className="lg:w-1/3 flex flex-col justify-between">
            <div className="bg-slate-950 rounded-[2.5rem] shadow-xl shadow-gray-900/40 h-[720px] flex flex-col overflow-hidden border border-white/10 sticky top-28">
              
              {/* Telemetry Header */}
              <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-slate-900 shrink-0">
                <Activity size={18} className="text-orange-500 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-white text-sm leading-tight uppercase tracking-wider">Live Stream Analytics</h3>
                  <p className="text-[10px] text-gray-400 font-bold">Real-time broadcast metrics &amp; audience interest</p>
                </div>
              </div>

              {/* TAB CONTENT: Analytical Engagement & Community Chart */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 text-white flex flex-col justify-between">
                
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
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Activity Frequency</span>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-2xl font-black text-white">{messagesPerMinute}</span>
                        <span className="text-[10px] text-gray-400 font-extrabold">pts/min</span>
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
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-wider">Top Stream Supporters</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Sarah J.", commentsCount: "12 interactions", rating: "VIP Patron" },
                      { name: "Kirehe_Foodie", commentsCount: "8 interactions", rating: "Culinary Fanatic" },
                      { name: "Mike Chef", commentsCount: "6 interactions", rating: "Baking Resident" }
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
                  Telemetry calculates active speeds, floating reactions, and viewer activity metrics natively.
                </p>

              </div>

            </div>
            
            {/* Other Live Now Streams List */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Radio className="text-red-500 animate-pulse" size={16} />
                <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest pl-1">Other Live Broadcasting Channels</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {streamsList.map((ls) => {
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
