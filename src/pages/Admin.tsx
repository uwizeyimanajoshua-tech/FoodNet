import React, { useState } from "react";
import { 
  Users, 
  Store, 
  Video, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  CheckCircle, 
  Search,
  ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";

export function Admin() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Users", val: "15,842", icon: <Users />, color: "bg-blue-50 text-blue-600" },
    { label: "Active Stores", val: "420", icon: <Store />, color: "bg-orange-50 text-orange-600" },
    { label: "Total Revenue", val: "$245,000", icon: <DollarSign />, color: "bg-green-50 text-green-600" },
    { label: "Pending Streams", val: "12", icon: <Video />, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-gray-950 text-white hidden lg:block sticky top-24 h-[calc(100vh-6rem)]">
        <div className="p-8 space-y-10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Admin Console</span>
          </div>

          <nav className="space-y-2">
            {["Overview", "Users", "Restaurants", "Livestreams", "Payments", "Reports"].map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label.toLowerCase())}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === label.toLowerCase() 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-950" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label === "Overview" && <Users size={18} />}
                {label === "Users" && <Users size={18} />}
                {label === "Restaurants" && <Store size={18} />}
                {label === "Livestreams" && <Video size={18} />}
                {label === "Payments" && <DollarSign size={18} />}
                {label === "Reports" && <AlertCircle size={18} />}
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-6 md:p-12 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">System {activeTab}</h1>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center px-4 w-96">
            <Search size={20} className="text-gray-400 mr-3" />
            <input type="text" placeholder="Search anything..." className="w-full bg-transparent border-none outline-none font-medium text-sm py-2" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{stat.val}</p>
              </div>
              <div className={`w-14 h-14 ${stat.color} rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-current/10`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Recent Registrations Table */}
          <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Recent Users</h3>
              <button className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Export Data <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {[
                    { user: "Alice Green", role: "Customer", status: "Active", email: "alice@example.com" },
                    { user: "Chef Marco", role: "Chef", status: "Pending Approval", email: "marco@kitchen.com" },
                    { user: "Bob Builder", role: "Courier", status: "Active", email: "bob@delivery.com" },
                    { user: "Chef Julia", role: "Chef", status: "Active", email: "julia@gourmet.com" },
                  ].map((u, i) => (
                    <tr key={i} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-6 flex items-center gap-4">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-xl" />
                        <div>
                          <p className="font-bold text-gray-900">{u.user}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-6">{u.role}</td>
                      <td className="px-4 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${u.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-right space-x-2">
                        <button className="p-2 text-gray-300 hover:text-blue-500 transition-colors"><CheckCircle size={18} /></button>
                        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Alerts */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">System Alerts</h3>
            <div className="space-y-6">
               <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex gap-4">
                 <AlertCircle className="text-red-600 shrink-0" size={24} />
                 <div>
                   <p className="font-bold text-red-900">High Refund Rate</p>
                   <p className="text-xs text-red-700/80 mt-1">"Sakura Sushi" has seen a 15% increase in refunds.</p>
                 </div>
               </div>
               <div className="p-6 bg-orange-50 border border-orange-100 rounded-[2rem] flex gap-4">
                 <Video className="text-orange-600 shrink-0" size={24} />
                 <div>
                   <p className="font-bold text-orange-900">Stream Pending</p>
                   <p className="text-xs text-orange-700/80 mt-1">Chef Antonio is requesting to start a high-capacity stream.</p>
                 </div>
               </div>
               <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex gap-4">
                 <DollarSign className="text-blue-600 shrink-0" size={24} />
                 <div>
                   <p className="font-bold text-blue-900">Payout Period</p>
                   <p className="text-xs text-blue-700/80 mt-1">Current payout cycle ends in 4 hours. 142 chefs pending.</p>
                 </div>
               </div>
            </div>
            
            <button className="w-full mt-10 bg-gray-950 text-white py-5 rounded-[2rem] font-extrabold text-lg shadow-xl hover:bg-black transition-all">
               Run Full Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
