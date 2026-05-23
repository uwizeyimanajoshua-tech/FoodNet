import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  ShoppingBag, 
  Video, 
  TrendingUp, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Utensils,
  Store,
  DollarSign,
  Loader2,
  Navigation,
  Truck,
  MapPin,
  Mail,
  Trash2,
  Edit,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useFoods } from "../components/FoodsContext";
import { collection, getDocs, query, limit, doc, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-hot-toast";
import { handleFirestoreError, OperationType } from "../lib/errorHandler";
import { seedDatabase } from "../lib/seed";

const AdminDashboard = () => {
  const handleSeed = async () => {
    toast.loading("Seeding data...", { id: "seed" });
    const success = await seedDatabase();
    if (success) {
        toast.success("Database seeded successfully!", { id: "seed" });
        // Refresh data
        window.location.reload();
    } else {
        toast.error("Failed to seed database.", { id: "seed" });
    }
  };
  const { user, logout } = useAuth();
  const { deleteFoodItem } = useFoods();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [foodsList, setFoodsList] = useState<any[]>([]);
  const [restaurantsList, setRestaurantsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    restaurants: 0,
    totalRevenue: 0
  });

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [payFilterProvider, setPayFilterProvider] = useState<string>("ALL");
  const [payFilterStatus, setPayFilterStatus] = useState<string>("ALL");
  const [paySearchQuery, setPaySearchQuery] = useState<string>("");

  // Custom delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState<{
    itemId: string;
    itemType: string;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Food Items Manager States
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    price: 3500,
    category: "Traditional",
    description: "",
    image: "",
    deliveryTime: "30-40 mins",
    rating: 4.8,
    reviews: 12,
    isVegetarian: false,
    isPopular: true,
    chef: {
        name: "Chef Joshua",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&h=120&fit=crop",
        quote: "Traditional Rwandan foods are a gateway to our culinary soul."
      }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image is too large. Choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoodForm(prev => ({ ...prev, image: reader.result as string }));
        toast.success("Image loaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.image) {
      toast.error("Please provide a Name, Price, and Food Image!");
      return;
    }

    const toastId = toast.loading(editingFood ? "Updating food item..." : "Saving new food item...");
    try {
      if (editingFood) {
        // Update document in Firestore
        const foodRef = doc(db, "foods", editingFood.id);
        const updatedFields = {
          name: foodForm.name,
          price: Number(foodForm.price),
          category: foodForm.category,
          description: foodForm.description,
          image: foodForm.image,
          isVegetarian: foodForm.isVegetarian,
          isPopular: foodForm.isPopular,
          deliveryTime: foodForm.deliveryTime,
          chef: foodForm.chef
        };
        await updateDoc(foodRef, updatedFields);
        
        // Update local list
        setFoodsList(prev => prev.map(f => f.id === editingFood.id ? { ...f, ...updatedFields } : f));
        toast.success("Dish updated successfully!", { id: toastId });
      } else {
        // Create document in Firestore
        const docId = foodForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
        const newDoc = {
          id: docId,
          name: foodForm.name,
          price: Number(foodForm.price),
          category: foodForm.category,
          description: foodForm.description,
          image: foodForm.image,
          rating: 4.8,
          reviews: 1,
          isVegetarian: foodForm.isVegetarian,
          isPopular: foodForm.isPopular,
          deliveryTime: foodForm.deliveryTime,
          chef: foodForm.chef,
          createdAt: new Date()
        };
        await setDoc(doc(db, "foods", docId), newDoc);
        
        // Update local state
        setFoodsList(prev => [...prev, newDoc]);
        toast.success("New dish added to catalog!", { id: toastId });
      }
      setIsFoodModalOpen(false);
      setEditingFood(null);
    } catch (err) {
      console.error("Save food error:", err);
      toast.error("Failed to save food configuration.", { id: toastId });
    }
  };

  const handleDeleteFood = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete({
      itemId: id,
      itemType: "food",
      title: "Remove Dish",
      message: "Are you sure you want to remove this dish from the catalog? This is permanent.",
      onConfirm: async () => {
        const toastId = toast.loading("Removing food item...");
        try {
          await deleteFoodItem(id);
          setFoodsList(prev => prev.filter(f => f.id !== id));
          toast.success("Food item deleted from catalog.", { id: toastId });
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `foods/${id}`, "Failed to delete food item.");
        }
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmDelete({
      itemId: userId,
      itemType: "user",
      title: "Delete Profile",
      message: "Are you sure you want to delete this user? This cannot be undone and will delete their access profile.",
      onConfirm: async () => {
        const toastId = toast.loading("Deleting user profile...");
        try {
          await deleteDoc(doc(db, "users", userId));
          setUsersList(prev => prev.filter(u => u.id !== userId));
          toast.success("User profile deleted successfully", { id: toastId });
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${userId}`, "Failed to delete user profile.");
        }
      }
    });
  };

  const handleDeleteRestaurant = (resId: string) => {
    setConfirmDelete({
      itemId: resId,
      itemType: "restaurant",
      title: "Remove Partner Restaurant",
      message: "Are you sure you want to remove this partner restaurant from your platform list?",
      onConfirm: async () => {
        const toastId = toast.loading("Removing partner restaurant...");
        try {
          await deleteDoc(doc(db, "restaurants", resId));
          setRestaurantsList(prev => prev.filter(r => r.id !== resId));
          toast.success("Restaurant deleted successfully", { id: toastId });
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `restaurants/${resId}`, "Failed to delete restaurant.");
        }
      }
    });
  };

  const handleDeletePayment = (payId: string) => {
    setConfirmDelete({
      itemId: payId,
      itemType: "payment",
      title: "Delete Transaction",
      message: "Are you sure you want to delete this payment record? This will erase it from the platform ledger.",
      onConfirm: async () => {
        const toastId = toast.loading("Deleting payment record...");
        try {
          await deleteDoc(doc(db, "payments", payId));
          setPaymentsList(prev => prev.filter(p => p.id !== payId));
          toast.success("Payment transaction deleted", { id: toastId });
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `payments/${payId}`, "Failed to delete payment record.");
        }
      }
    });
  };

  const handleEditOpen = (food: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFood(food);
    setFoodForm({
      name: food.name || "",
      price: food.price || 3500,
      category: food.category || "Traditional",
      description: food.description || "",
      image: food.image || "",
      deliveryTime: food.deliveryTime || "30-40 mins",
      rating: food.rating || 4.8,
      reviews: food.reviews || 12,
      isVegetarian: food.isVegetarian || false,
      isPopular: food.isPopular !== undefined ? food.isPopular : true,
      chef: food.chef || {
        name: "Chef Joshua",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&h=120&fit=crop",
        quote: "Traditional Rwandan foods are a gateway to our culinary soul."
      }
    });
    setIsFoodModalOpen(true);
  };

  const handleCreateOpen = () => {
    setEditingFood(null);
    setFoodForm({
      name: "",
      price: 3500,
      category: "Traditional",
      description: "",
      image: "",
      deliveryTime: "30-40 mins",
      rating: 4.8,
      reviews: 1,
      isVegetarian: false,
      isPopular: true,
      chef: {
        name: "Chef Joshua",
        avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&h=120&fit=crop",
        quote: "Traditional Rwandan foods are a gateway to our culinary soul."
      }
    });
    setIsFoodModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersList(users);

        const foodsSnap = await getDocs(collection(db, "foods"));
        setFoodsList(foodsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const restaurantsSnap = await getDocs(collection(db, "restaurants"));
        const restaurants = restaurantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurantsList(restaurants);

        const ordersSnap = await getDocs(collection(db, "orders"));
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        setOrdersList(orders);
        const revenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

        const messagesSnap = await getDocs(collection(db, "messages"));
        setMessagesList(messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const paymentsSnap = await getDocs(collection(db, "payments"));
        setPaymentsList(paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setStats({
          users: users.length,
          orders: ordersSnap.size || 0,
          restaurants: restaurants.length,
          totalRevenue: revenue
        });
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        handleFirestoreError(err, OperationType.LIST, "dashboard_multiple_collections", "Failed to load dashboard data. Some panels may be empty.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
     try {
       await updateDoc(doc(db, "orders", orderId), { 
         status,
         updatedAt: serverTimestamp() 
       });
       setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
       toast.success(`Order #${orderId.slice(0,8)} status updated to ${status}`);
     } catch (err) {
       handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`, "Failed to update order status");
     }
  };

  const simulateDriverMovement = async (orderId: string) => {
    try {
      // Small random Jitter around Kirehe center
      const lat = -2.26 + (Math.random() - 0.5) * 0.01;
      const lng = 30.65 + (Math.random() - 0.5) * 0.01;
      
      await updateDoc(doc(db, "orders", orderId), { 
        deliveryLat: lat,
        deliveryLng: lng,
        status: "delivering",
        updatedAt: serverTimestamp() 
      });
      
      setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, deliveryLat: lat, deliveryLng: lng, status: "delivering" } : o));
      toast.success("Driver location updated on map!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePhoto = async (userId: string, photoURL: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { photoURL });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, photoURL } : u));
      toast.success("Profile photo updated");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`, "Failed to update photo");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`, "Failed to update user role");
    }
  };

  const handleDeleteMessage = (id: string) => {
    setConfirmDelete({
      itemId: id,
      itemType: "message",
      title: "Delete Message",
      message: "Are you sure you want to archive and completely delete this contact message?",
      onConfirm: async () => {
        const toastId = toast.loading("Deleting message...");
        try {
          await deleteDoc(doc(db, "messages", id));
          setMessagesList(prev => prev.filter(m => m.id !== id));
          toast.success("Message deleted", { id: toastId });
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `messages/${id}`, "Failed to delete message.");
        }
      }
    });
  };

  const adminMenu = [
    { name: "Dashboard", icon: <TrendingUp size={20} /> },
    { name: "User Management", icon: <Users size={20} />, count: stats.users },
    { name: "Foods", icon: <Utensils size={20} />, count: foodsList.length },
    { name: "Restaurants", icon: <Store size={20} />, count: stats.restaurants },
    { name: "Payments", icon: <DollarSign size={20} />, count: paymentsList.length },
    { name: "Live Streams", icon: <Video size={20} />, count: 3 },
    { name: "Delivery Tracking", icon: <Truck size={20} /> },
    { name: "User Messages", icon: <Mail size={20} />, count: messagesList.length },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
            <Link to="/" className="hover:scale-105 transition-transform">
                <img src="/foodnet.png" alt="FoodNet Logo" className="h-16 w-auto" referrerPolicy="no-referrer" />
            </Link>
            <h2 className="text-2xl font-black tracking-tighter text-gray-900">Admin</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {adminMenu.map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
                activeTab === item.name ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" : "hover:bg-orange-50 text-gray-500 hover:text-orange-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
              </div>
              {item.count !== undefined && (
                <span className={`${activeTab === item.name ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"} px-3 py-1 rounded-full text-xs`}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-gray-100">
           <div className="flex items-center gap-4 p-4 mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black">
                {user?.displayName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="font-bold text-gray-900">{user?.displayName?.split(' ')[0] || "Admin"}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Super Admin</p>
              </div>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all"
           >
             <LogOut size={20} />
             Logout
           </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {activeTab === "Dashboard" ? `Welcome Back, ${user?.displayName?.split(' ')[0] || "Joshua"}` : activeTab}
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">Managing FoodNet in Kirehe, Rwanda.</p>
          </div>
        </header>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="animate-spin text-orange-600 mx-auto mb-4" size={40} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Data...</p>
            </div>
          </div>
        )}

        {activeTab === "Dashboard" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <TrendingUp size={24} />
                    </div>
                    <span className="text-green-500 font-bold text-sm">+12%</span>
                 </div>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                 <h3 className="text-3xl font-black text-gray-900">{stats.totalRevenue.toLocaleString()} <span className="text-sm font-medium">RWF</span></h3>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                      <ShoppingBag size={24} />
                    </div>
                    <span className="text-green-500 font-bold text-sm">+5</span>
                 </div>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Active Orders</p>
                 <h3 className="text-3xl font-black text-gray-900">{stats.orders}</h3>
               </div>
            </div>

            {/* Quick Actions / Dev Tools */}
            <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 mb-12">
               <h3 className="text-xl font-bold text-orange-950 mb-4 flex items-center gap-2">
                 <Settings size={20} />
                 Admin Quick Actions
               </h3>
               <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleSeed}
                    className="px-6 py-3 bg-white text-orange-600 border border-orange-200 rounded-2xl font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                  >
                    Seed Sample Data
                  </button>
                  <button 
                    className="px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:border-orange-600 hover:text-orange-600 transition-all shadow-sm"
                  >
                    Clear Analytics Cache
                  </button>
               </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900">Recent Transactions</h3>
                <button 
                  onClick={() => setActiveTab("Delivery Tracking")}
                  className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Manage All Orders <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="space-y-6">
                {ordersList.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 group hover:bg-orange-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-600">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-gray-400 font-medium">{order.userName || "Customer"} • {order.items?.length || 0} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">{order.total?.toLocaleString() || "0"} RWF</p>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'delivering' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {ordersList.length === 0 && (
                  <div className="text-center py-12 text-gray-400 font-bold italic">
                     No orders yet. Start your first Rwanda feast!
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "Delivery Tracking" && (
           <div className="space-y-12">
              <div className="flex justify-between items-center bg-gray-950 p-10 rounded-[3rem] text-white overflow-hidden relative">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-30 -translate-y-1/2"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2">Live Delivery Control</h2>
                    <p className="text-gray-400 font-medium">Manage and simulate real-time driver locations for Kirehe orders.</p>
                 </div>
                 <div className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-md relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Active Drivers</p>
                    <p className="text-2xl font-black">4 Online</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                 {ordersList.map((order) => (
                    <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-10 items-start">
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center font-black">
                                   #{order.id.slice(0, 3)}
                                </div>
                                <div>
                                   <h3 className="text-xl font-bold text-gray-900">{order.userName || "Customer"}</h3>
                                   <p className="text-sm text-gray-400">Order ID: {order.id}</p>
                                </div>
                             </div>
                             <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-none outline-none ring-4 ring-gray-50 bg-gray-50 ${
                                   order.status === 'delivered' ? 'text-green-600' :
                                   order.status === 'delivering' ? 'text-blue-600' :
                                   'text-orange-600'
                                }`}
                             >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="delivering">Delivering</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                             </select>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Driver</p>
                                <p className="font-bold text-gray-900 text-sm">{order.driverName || "Assigning..."}</p>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Location</p>
                                <p className="font-bold text-gray-900 text-sm truncate">{order.deliveryLat?.toFixed(4)}, {order.deliveryLng?.toFixed(4)}</p>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Items</p>
                                <p className="font-bold text-gray-900 text-sm">{order.items?.length || 0} Products</p>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">Phone</p>
                                <p className="font-bold text-gray-900 text-sm">{order.driverPhone || "N/A"}</p>
                             </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                             <button 
                               onClick={() => simulateDriverMovement(order.id)}
                               className="flex-1 bg-orange-600 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 hover:scale-[1.02] transition-all"
                             >
                                <Navigation size={20} />
                                Simulate Driver Step
                             </button>
                             <button className="px-6 py-5 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all">
                                Assign Driver
                             </button>
                          </div>
                       </div>

                       <div className="w-full lg:w-72 aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative">
                           {/* Mini Map Preview Mock */}
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="relative">
                                 <div className="w-4 h-4 bg-orange-600 rounded-full animate-ping opacity-50"></div>
                                 <div className="w-3 h-3 bg-orange-600 rounded-full border-2 border-white relative z-10"></div>
                              </div>
                           </div>
                           <div className="p-6 h-full flex flex-col justify-end bg-gradient-to-t from-black/20 to-transparent">
                              <p className="text-xs font-black text-white/80 uppercase tracking-tighter bg-black/40 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                                 Active GPS Tracking
                              </p>
                           </div>
                       </div>
                    </div>
                 ))}

                 {ordersList.length === 0 && (
                    <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                       <Truck size={64} className="mx-auto text-gray-200 mb-6" />
                       <h3 className="text-2xl font-bold text-gray-900 mb-2">No Deliveries in Sight</h3>
                       <p className="text-gray-400 font-medium">Wait for customers to place orders to track them here.</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === "Foods" && (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Food Items</h2>
                        <p className="text-sm text-gray-400 font-medium">Add, update descriptions, prices, delete or upload delicious foods.</p>
                    </div>
                    <button 
                        onClick={handleCreateOpen}
                        className="px-8 py-4.5 bg-orange-600 text-white rounded-[1.5rem] font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Food
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {foodsList.map((f) => (
                        <div key={f.id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                            <div>
                                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-gray-50">
                                    <img src={f.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"} className="w-full h-full object-cover" alt={f.name} />
                                    <div className="absolute top-4 right-4 flex gap-1.5">
                                        <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600">
                                            {f.category || "Traditional"}
                                        </span>
                                        {f.isVegetarian && (
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                Veg
                                            </span>
                                        )}
                                    </div>
                                    {f.isPopular && (
                                        <div className="absolute bottom-4 left-4 bg-yellow-400/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-gray-900 uppercase tracking-wider">
                                            Popular choice
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{f.name}</h3>
                                <p className="text-gray-400 text-sm font-medium line-clamp-3 mb-4 min-h-[3rem] leading-relaxed">
                                    {f.description || "No description provided."}
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-50 mt-auto flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</p>
                                    <p className="text-orange-600 font-black text-xl">{f.price?.toLocaleString()} RWF</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => handleEditOpen(f, e)}
                                        className="p-3 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-600 rounded-xl transition-all"
                                        title="Edit Item details"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteFood(f.id, e)}
                                        className="p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {foodsList.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <Utensils size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-700">No Food Items Listed</h3>
                            <p className="text-gray-400 font-medium">Add your first culinary choice using the button above.</p>
                        </div>
                    )}
                </div>

                {/* Overlaid Food Editor Drawer / Modal */}
                {isFoodModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[3rem] p-10 max-w-2xl w-full border border-gray-100 shadow-2xl overflow-y-auto max-h-[90vh] space-y-8"
                        >
                            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                                <div>
                                    <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Platform Dispatch</p>
                                    <h3 className="text-2xl font-black text-gray-900">{editingFood ? "Edit Food Specification" : "Create New Food Record"}</h3>
                                </div>
                                <button 
                                    onClick={() => setIsFoodModalOpen(false)}
                                    className="px-4 py-2 bg-gray-50 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <form onSubmit={handleSaveFood} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Name of Dish</label>
                                        <input 
                                            type="text"
                                            value={foodForm.name}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g. Traditional Goat Kila"
                                            className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Price (RWF)</label>
                                        <input 
                                            type="number"
                                            value={foodForm.price}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                            placeholder="e.g. 4500"
                                            className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Category</label>
                                        <select 
                                            value={foodForm.category}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                        >
                                            <option value="Traditional">Traditional</option>
                                            <option value="Grill">Grill</option>
                                            <option value="Stews">Stews</option>
                                            <option value="Street Food">Street Food</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Dessert">Dessert</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Cooking / Prep Time</label>
                                        <input 
                                            type="text"
                                            value={foodForm.deliveryTime}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                                            placeholder="e.g. 25-35 mins"
                                            className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                        />
                                    </div>
                                </div>

                                {/* Image handling: Link pasting or local upload selector */}
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Food Image URL</label>
                                        <input 
                                            type="text"
                                            value={foodForm.image}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, image: e.target.value }))}
                                            placeholder="Paste a direct image link or choose upload"
                                            className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-6 p-4 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                                <Upload size={22} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">Or Upload File Directly</p>
                                                <p className="text-xs text-gray-400 font-medium">Automatic base64 catalog encoding</p>
                                            </div>
                                        </div>
                                        <label className="relative cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold text-xs text-gray-700 transition-colors shrink-0">
                                            Choose File
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageUpload} 
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>

                                    {foodForm.image && (
                                        <div className="relative aspect-video max-w-xs rounded-2xl overflow-hidden border border-gray-100 shadow-sm mx-auto">
                                            <img src={foodForm.image} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => setFoodForm(prev => ({ ...prev, image: "" }))}
                                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg text-xs"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-black uppercase text-gray-400 tracking-wider ml-1">Description</label>
                                    <textarea 
                                        rows={3}
                                        value={foodForm.description}
                                        onChange={(e) => setFoodForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Explain ingredients, taste qualities, and preparation highlights..."
                                        className="px-4 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl outline-none focus:border-orange-500 font-bold text-sm text-gray-800"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={foodForm.isVegetarian}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                                            className="w-5 h-5 rounded accent-orange-600 cursor-pointer"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">Vegetarian Friendly</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Guarantees green eco labeling</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={foodForm.isPopular}
                                            onChange={(e) => setFoodForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                                            className="w-5 h-5 rounded accent-orange-600 cursor-pointer"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">Home Spotlight</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Spotlights under popular foods</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-50">
                                    <button 
                                        type="button"
                                        onClick={() => setIsFoodModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-600/10"
                                    >
                                        {editingFood ? "Save Modification" : "Publish to Catalog"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        )}

        {activeTab === "Restaurants" && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Partner Restaurants</h2>
                    <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/20 flex items-center gap-2">
                        <Plus size={18} />
                        Register Restaurant
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {restaurantsList.map((r) => (
                        <div key={r.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex gap-8 items-center">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                                <img src={r.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop"} className="w-full h-full object-cover" alt={r.name} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{r.name}</h3>
                                    <div className="flex items-center gap-1 text-orange-400">
                                        <CheckCircle2 size={16} />
                                        <span className="text-sm font-black">{r.rating || "4.5"}</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm font-medium mb-4">{r.address || "Kirehe Main Street"}</p>
                                <div className="flex gap-3">
                                    <button className="text-xs font-black uppercase tracking-widest text-orange-600 hover:underline">Edit Info</button>
                                    <button 
                                        onClick={() => handleDeleteRestaurant(r.id)}
                                        className="text-xs font-black uppercase tracking-widest text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {restaurantsList.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 font-bold text-gray-400">
                            No restaurants registered yet.
                        </div>
                    )}
                </div>
             </div>
        )}
        {activeTab === "Payments" && (() => {
            const filteredPayments = paymentsList.filter(p => {
                const origProvider = p.provider?.toUpperCase() || "";
                const filterProv = payFilterProvider?.toUpperCase();
                const matchesProvider = filterProv === "ALL" || origProvider === filterProv;

                const origStatus = p.status?.toUpperCase() || "";
                const filterStat = payFilterStatus?.toUpperCase();
                const matchesStatus = filterStat === "ALL" || origStatus === filterStat;

                const matchesSearch = !paySearchQuery || 
                  p.phoneNumber?.includes(paySearchQuery) || 
                  p.orderId?.includes(paySearchQuery) || 
                  p.id?.includes(paySearchQuery);

                return matchesProvider && matchesStatus && matchesSearch;
            });

            const handleExportCSV = () => {
                const headers = ["ID", "User ID", "Amount (RWF)", "Phone Number", "Provider", "Status", "Order ID", "Date"];
                const rows = filteredPayments.map(p => [
                    p.id,
                    p.userId,
                    p.amount,
                    `'${p.phoneNumber}`, 
                    p.provider,
                    p.status,
                    p.orderId,
                    p.createdAt?.toDate?.()?.toISOString() || "Today"
                ]);

                const csvContent = "data:text/csv;charset=utf-8," 
                    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `foodnet_momo_transactions_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("CSV transactions statement exported!");
            };

            return (
                <div className="space-y-8">
                    <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 mb-1">MoMo Gateway Transactions</h2>
                            <p className="text-gray-400 font-medium">Verify incoming payments from MTN and Airtel customers.</p>
                        </div>
                        <button 
                            onClick={handleExportCSV}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-sm uppercase tracking-wider shrink-0"
                        >
                            Export Statement (CSV)
                        </button>
                    </div>

                    {/* Filter controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-2">Search Transactions</label>
                            <input 
                                type="text"
                                value={paySearchQuery}
                                onChange={(e) => setPaySearchQuery(e.target.value)}
                                placeholder="Search Phone, ID or Order..."
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-bold text-sm text-gray-700 placeholder:text-gray-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-2">MoMo Network Provider</label>
                            <select 
                                value={payFilterProvider}
                                onChange={(e) => setPayFilterProvider(e.target.value)}
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-bold text-sm text-gray-700"
                            >
                                <option value="ALL">All Networks</option>
                                <option value="MTN">MTN MoMo</option>
                                <option value="Airtel">Airtel Money</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-2">Payment Status</label>
                            <select 
                                value={payFilterStatus}
                                onChange={(e) => setPayFilterStatus(e.target.value)}
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500 font-bold text-sm text-gray-700"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="SUCCESSFUL">Success Only</option>
                                <option value="PENDING_APPROVAL">Pending Approval</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {filteredPayments.map((p) => (
                            <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xs ${
                                        p.provider === "MTN" ? "bg-yellow-400 text-gray-900" : "bg-red-600 text-white"
                                    }`}>
                                        {p.provider}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-xl">{p.phoneNumber}</h3>
                                        <p className="text-sm text-gray-400 font-medium">Order: #{p.orderId} • {p.createdAt?.toDate?.()?.toLocaleString() || "Today"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center md:items-end">
                                        <p className="text-2xl font-black text-gray-900">{p.amount?.toLocaleString()} <span className="text-xs">RWF</span></p>
                                        <span className={`mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            p.status === "SUCCESSFUL" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                                        }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeletePayment(p.id)}
                                        className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all shadow-xs"
                                        title="Delete Payment Record"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredPayments.length === 0 && (
                            <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 font-bold text-gray-400">
                                No matching payment transactions found.
                            </div>
                        )}
                    </div>
                </div>
            );
        })()}

        {activeTab === "Live Streams" && (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active & Scheduled Streams</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { id: "1", title: "Rwandan Coffee Masterclass", chef: "Chef Joshua", status: "live", viewers: 120 },
                        { id: "2", title: "Traditional Isombe Cooking", chef: "Chef Marie", status: "scheduled", viewers: 0 }
                    ].map((s) => (
                        <div key={s.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${s.status === 'live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} rounded-2xl flex items-center justify-center`}>
                                        <Video size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{s.title}</h3>
                                        <p className="text-gray-400 font-medium">{s.chef}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                    {s.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                                    <Users size={16} />
                                    {s.viewers} Watching
                                </div>
                                <div className="flex gap-4">
                                    <button className="text-sm font-black uppercase tracking-widest text-orange-600 hover:scale-105 transition-transform">Moderate</button>
                                    <button className="text-sm font-black uppercase tracking-widest text-red-600 hover:scale-105 transition-transform">End Stream</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === "Settings" && (
            <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm max-w-2xl">
                <h2 className="text-2xl font-black text-gray-900 mb-8">Platform Settings</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <div>
                            <p className="font-bold text-gray-900">Maintenance Mode</p>
                            <p className="text-sm text-gray-400">Suspend all client-side orders</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <div>
                            <p className="font-bold text-gray-900">New User Registration</p>
                            <p className="text-sm text-gray-400">Allow new accounts to be created</p>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 mt-8">
                        Save Global Config
                    </button>
                </div>
            </div>
        )}

        {activeTab === "User Management" && (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Role</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {usersList.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                                            {u.displayName?.charAt(0) || u.email?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{u.displayName || "No Name"}</p>
                                            <p className="text-sm text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <select 
                                        value={u.role || "user"}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="bg-gray-100 border-none rounded-lg px-3 py-1 font-bold text-sm outline-none focus:ring-2 ring-orange-100"
                                    >
                                        <option value="user">User</option>
                                        <option value="chef">Chef</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {u.role === "chef" && (u.displayName?.includes("NK") || u.displayName?.includes("Karisa")) && (
                                        <span className="ml-2 bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Master Chef</span>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <input 
                                        type="text" 
                                        placeholder="Photo URL"
                                        defaultValue={u.photoURL}
                                        onBlur={(e) => {
                                            if (e.target.value !== u.photoURL) {
                                                handleUpdatePhoto(u.id, e.target.value);
                                            }
                                        }}
                                        className="bg-gray-100 border-none rounded-lg px-3 py-1 text-[10px] outline-none focus:ring-2 ring-orange-100 w-24"
                                    />
                                </td>
                                <td className="px-8 py-6 text-sm font-bold text-green-500">Active</td>
                                <td className="px-8 py-6 text-right flex items-center justify-end gap-3 pt-8">
                                    <button className="text-orange-600 font-bold hover:underline text-sm">Edit</button>
                                    <button 
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === "User Messages" && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    {messagesList.map((m) => (
                        <div key={m.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                                        <p className="text-sm text-gray-400">{m.email} • {m.createdAt?.toDate?.()?.toLocaleString() || "Recent"}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteMessage(m.id)}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            {m.subject && <p className="font-black text-gray-900 mb-2 uppercase tracking-wide text-xs">Subject: {m.subject}</p>}
                            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-gray-600 font-medium leading-relaxed">
                                {m.message}
                            </div>
                        </div>
                    ))}
                    {messagesList.length === 0 && (
                        <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 font-bold text-gray-400">
                            No messages from users yet.
                        </div>
                    )}
                </div>
            </div>
        )}
      </main>

      {/* Custom Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full border border-gray-100 shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
              <Trash2 size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">{confirmDelete.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{confirmDelete.message}</p>
            </div>
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 px-5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const onConfirm = confirmDelete.onConfirm;
                  setConfirmDelete(null);
                  await onConfirm();
                }}
                className="flex-1 py-3 px-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
