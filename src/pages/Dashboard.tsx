import React, { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Video, 
  BarChart3, 
  Settings, 
  Bell, 
  ChevronRight, 
  Plus,
  Play,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Users,
  LogIn,
  Package
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";

export function Dashboard() {
  const { user, loading, isAdmin, signIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    
    // For users, show their own orders. For admin/chef, show all orders.
    const ordersRef = collection(db, "orders");
    const q = isAdmin 
      ? query(ordersRef, orderBy("createdAt", "desc"), limit(10))
      : query(ordersRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(10));

    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    // Fetch payments for tracking history
    const paymentsRef = collection(db, "payments");
    const pq = isAdmin
      ? query(paymentsRef, orderBy("createdAt", "desc"), limit(20))
      : query(paymentsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(20));

    const unsubPayments = onSnapshot(pq, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error fetching payments:", error);
    });

    return () => {
      unsub();
      unsubPayments();
    };
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-orange-50 p-12 rounded-[3.5rem] border border-orange-100 max-w-md w-full shadow-2xl shadow-orange-100/50">
          <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
            <LayoutDashboard size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome to FoodNet</h1>
          <p className="text-gray-500 font-medium mb-12">Sign in to manage your orders, livestreams, and profile.</p>
          <button 
            onClick={signIn}
            className="w-full bg-gray-950 text-white py-5 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const role = isAdmin ? "chef" : "user";

  const sidebarItems = role === "chef" ? [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "orders", label: "Manage Orders", icon: <ShoppingBag size={20} /> },
    { id: "livestreams", label: "Livestreams", icon: <Video size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ] : [
    { id: "overview", label: "My Profile", icon: <Users size={20} /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag size={20} /> },
    { id: "payments", label: "Payment History", icon: <DollarSign size={20} /> },
    { id: "favorites", label: "Favorites", icon: <Video size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Earnings", val: "$12,450", icon: <DollarSign />, trend: "+12.5%", color: "bg-green-50 text-green-600" },
                { label: "Total Orders", val: orders.length.toString(), icon: <ShoppingBag />, trend: "+5.2%", color: "bg-blue-50 text-blue-600" },
                { label: "Daily Viewers", val: "3.2k", icon: <Users />, trend: "+18.3%", color: "bg-purple-50 text-purple-600" },
                { label: "Avg. Rating", val: "4.9", icon: <TrendingUp />, trend: "+0.1", color: "bg-orange-50 text-orange-600" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-gray-900">{stat.val}</p>
                  </div>
                  <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp size={14} /> {stat.trend} from last week
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Recent Orders */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-orange-600 font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                      <p className="text-gray-500 font-bold">No orders found</p>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-orange-600 shadow-sm">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.items?.map((it: any) => it.name).join(", ").slice(0, 30)}...
                            </p>
                            <p className="text-xs text-gray-500">Order #{order.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 mb-1">
                              {order.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Recently'}
                            </p>
                            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                              order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                              order.status === 'delivering' ? 'bg-blue-100 text-blue-600' : 
                              order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <Link to={`/track/${order.id}`}>
                            <button className="bg-white p-3 rounded-xl border border-gray-200 text-gray-400 group-hover:text-orange-600 group-hover:border-orange-200 transition-all shadow-sm">
                              <ChevronRight size={20} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Next Livestream */}
              <div className="bg-orange-600 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <h3 className="text-2xl font-bold mb-8 relative z-10">Your Next Livestream</h3>
                <div className="bg-white/20 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
                      <Video size={40} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Pasta Carbonara Secrets</h4>
                      <p className="text-orange-100 font-medium">Coming up in 2 hours</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-xs font-bold uppercase opacity-60 mb-1">Subscribers</p>
                      <p className="text-xl font-extrabold">12.5k</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl">
                      <p className="text-xs font-bold uppercase opacity-60 mb-1">Pre-Orders</p>
                      <p className="text-xl font-extrabold">142</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveTab("livestreams")} className="w-full mt-10 bg-white text-orange-600 py-5 rounded-[2rem] font-extrabold text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
                  Manage Livestreams
                  <ChevronRight />
                </button>
              </div>
            </div>
          </>
        );
      case "orders":
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-10">All Orders</h3>
            <div className="space-y-6">
               {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-orange-600 shadow-sm border border-gray-100">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {order.items?.map((it: any) => it.name).join(", ")}
                        </p>
                        <p className="text-xs text-gray-500">Order #{order.id} • {order.createdAt?.toDate?.()?.toLocaleString() || "Recent"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <p className="font-black text-gray-900">{order.total?.toLocaleString()} RWF</p>
                       <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                          order.status === 'delivering' ? 'bg-blue-100 text-blue-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {order.status}
                        </span>
                        <Link to={`/track/${order.id}`}>
                            <button className="text-sm font-bold text-orange-600 hover:underline">Track Order</button>
                        </Link>
                    </div>
                  </div>
               ))}
               {orders.length === 0 && <p className="text-gray-400 font-bold text-center py-12">No orders found.</p>}
            </div>
          </div>
        );
      case "payments":
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-2">MoMo Payments</h3>
            <p className="text-sm text-gray-400 font-medium mb-10">Historical records of your MTN MoMo and Airtel Money transactions.</p>
            <div className="space-y-6">
               {payments.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shrink-0 select-none ${
                        p.provider === "MTN" ? "bg-yellow-400 text-gray-900" : "bg-red-600 text-white"
                      }`}>
                        {p.provider}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {p.phoneNumber || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          Ref: {p.transactionId?.slice(0, 16) || p.id?.slice(0, 12)} • {p.createdAt?.toDate?.()?.toLocaleString() || "Today"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                       <p className="font-black text-gray-900 text-lg">{p.amount?.toLocaleString()} <span className="text-xs font-bold text-gray-400">RWF</span></p>
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          p.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-600' :
                          p.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                          'bg-orange-100 text-orange-600 animate-pulse'
                       }`}>
                          {p.status}
                       </span>
                    </div>
                  </div>
               ))}
               {payments.length === 0 && (
                 <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-100 font-bold text-gray-400">
                   No payments recorded yet.
                 </div>
               )}
            </div>
          </div>
        );
      case "livestreams":
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-10">Your Livestreams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center gap-6 group hover:border-orange-200 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                    <Plus size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Schedule New Stream</p>
                    <p className="text-sm text-gray-400">Share your culinary skills with the world</p>
                  </div>
               </div>
               <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">UPCOMING</div>
                  <h4 className="text-xl font-bold mb-2">Pasta Carbonara Secrets</h4>
                  <p className="text-gray-400 text-sm mb-6">Today at 6:00 PM</p>
                  <button className="w-full bg-white text-gray-900 py-3 rounded-2xl font-bold hover:bg-orange-600 hover:text-white transition-all">
                    Go Live Room
                  </button>
               </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-10">Sales Analytics</h3>
            <div className="h-64 flex items-end justify-between gap-2">
               {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-orange-100 rounded-t-xl relative group hover:bg-orange-600 transition-all" style={{ height: `${h}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                      {h*120} RWF
                    </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <span>Mon</span>
               <span>Tue</span>
               <span>Wed</span>
               <span>Thu</span>
               <span>Fri</span>
               <span>Sat</span>
               <span>Sun</span>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h3>
            <div className="space-y-6">
               <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl">
                  <img src={user.photoURL || "https://i.pravatar.cc/100"} className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl" alt="Profile" />
                  <div>
                    <button className="text-sm font-bold text-orange-600 hover:underline">Change Photo</button>
                    <p className="text-xs text-gray-400 mt-1">Recommended: Square image, max 2MB</p>
                  </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Display Name</label>
                 <input type="text" defaultValue={user.displayName} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-orange-100 transition-all font-bold" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Bio / Speciality</label>
                 <textarea defaultValue="Master Chef specializing in Rwandan cuisine." rows={3} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-orange-100 transition-all font-bold" />
               </div>
               <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all">
                  Save Changes
               </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="p-10 space-y-12">
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-3xl border border-orange-100">
            <img src={user.photoURL || "https://i.pravatar.cc/100"} className="w-14 h-14 rounded-2xl shadow-lg" alt="Profile" />
            <div className="overflow-hidden">
              <p className="font-extrabold text-gray-900 truncate">{user.displayName}</p>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-widest">{role}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-gray-950 text-white shadow-xl shadow-gray-200" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-12">
            <button 
              onClick={logout}
              className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                {activeTab === "overview" ? `${role} Dashboard` : activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h1>
              <p className="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-white p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-orange-600 transition-all relative">
                <Bell size={24} />
                <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {role === "chef" && (
                <button 
                  onClick={() => setActiveTab("livestreams")}
                  className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 flex items-center gap-3 hover:bg-orange-700 transition-all"
                >
                  <Play size={18} fill="white" />
                  Start Live Stream
                </button>
              )}
            </div>
          </div>

          <div className="space-y-12">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
