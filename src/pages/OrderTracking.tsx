import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  useMap,
  useMapsLibrary
} from "@vis.gl/react-google-maps";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronLeft,
  CheckCircle2,
  Package,
  Utensils,
  Navigation
} from "lucide-react";

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
const hasValidKey = Boolean(API_KEY) && API_KEY !== "";

// Kirehe, Rwanda coordinates
const KIREHE_CENTER = { lat: -2.26, lng: 30.65 };

interface OrderData {
  id: string;
  status: "pending" | "confirmed" | "delivering" | "delivered" | "cancelled";
  deliveryLat?: number;
  deliveryLng?: number;
  driverName?: string;
  driverPhone?: string;
  estimatedArrival?: any;
  items: any[];
  total: number;
}

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const unsub = onSnapshot(doc(db, "orders", orderId), (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() } as OrderData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching order:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find the order you're looking for.</p>
        <Link to="/" className="text-orange-600 font-bold flex items-center gap-2">
          <ChevronLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Map Section */}
        <div className="lg:col-span-2 h-[400px] lg:h-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
          {!hasValidKey ? (
            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center p-12 text-center">
              <MapPin size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Map Preview</h3>
              <p className="text-gray-500 max-w-sm">
                Real-time delivery map is disabled. Please provide a GOOGLE_MAPS_PLATFORM_KEY in settings to enable it.
              </p>
            </div>
          ) : (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={KIREHE_CENTER}
                defaultZoom={15}
                mapId="ORDER_TRACKING_MAP"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                {order.status === "delivering" && order.deliveryLat && order.deliveryLng && (
                  <AdvancedMarker 
                    position={{ lat: order.deliveryLat, lng: order.deliveryLng }}
                    title="Driver Location"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping opacity-25"></div>
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white relative z-10">
                        <Truck size={24} className="text-white" />
                      </div>
                    </div>
                  </AdvancedMarker>
                )}
                
                {/* Destination Marker */}
                <AdvancedMarker position={KIREHE_CENTER}>
                   <Pin background="#111827" glyphColor="#fff" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          )}
        </div>

        {/* Tracking Details */}
        <div className="space-y-8">
          {/* Status Header */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                order.status === 'delivering' ? 'bg-blue-100 text-blue-600' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {order.status}
              </span>
              <span className="text-gray-400 text-sm font-bold">#{order.id.slice(0, 8)}</span>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {order.status === 'pending' && "Preparing your feast..."}
              {order.status === 'confirmed' && "Chef is cooking!"}
              {order.status === 'delivering' && "On its way to you!"}
              {order.status === 'delivered' && "Enjoy your meal!"}
              {order.status === 'cancelled' && "Order Cancelled"}
            </h2>
            <p className="text-gray-500 font-medium">
              {order.status === 'delivering' ? "Our driver is navigating the Kirehe streets." : "Your Rwandan culinary journey is underway."}
            </p>
          </div>

          {/* Stepper */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <StatusItem 
              active={['pending', 'confirmed', 'delivering', 'delivered'].includes(order.status)} 
              completed={['confirmed', 'delivering', 'delivered'].includes(order.status)}
              icon={<Package size={20} />} 
              label="Order Received" 
              time="Just now"
            />
            <StatusItem 
              active={['confirmed', 'delivering', 'delivered'].includes(order.status)} 
              completed={['delivering', 'delivered'].includes(order.status)}
              icon={<Utensils size={20} />} 
              label="Chef Preparing" 
              time="Estimated 15 mins"
            />
            <StatusItem 
              active={['delivering', 'delivered'].includes(order.status)} 
              completed={order.status === 'delivered'}
              icon={<Truck size={20} />} 
              label="Out for Delivery" 
              time="Real-time tracking"
            />
            <StatusItem 
              active={order.status === 'delivered'} 
              completed={order.status === 'delivered'}
              icon={<CheckCircle2 size={20} />} 
              label="Delivered" 
              time="Hand-off point"
            />
          </div>

          {/* Driver Details */}
          {order.status === 'delivering' && order.driverName && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center">
                  <Truck size={32} />
                </div>
                <div>
                  <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-1">Your Driver</p>
                  <h4 className="text-xl font-bold">{order.driverName}</h4>
                  <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                    <Navigation size={14} /> Kirehe District
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4 relative z-10">
                <a 
                  href={`tel:${order.driverPhone}`}
                  className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold"
                >
                  <Phone size={18} /> Call
                </a>
                <div className="flex-1 bg-orange-600 p-4 rounded-2xl flex flex-col items-center justify-center">
                   <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">Arrival</p>
                   <p className="text-lg font-black leading-none">8 MINS</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Support */}
          <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center">
                  <Phone size={18} />
               </div>
               <div>
                 <p className="font-bold text-gray-900">Need help?</p>
                 <p className="text-xs text-orange-600 font-medium">Contact Kirehe Support</p>
               </div>
            </div>
            <button className="bg-white px-6 py-3 rounded-xl font-bold text-gray-900 text-sm shadow-sm hover:shadow-md transition-all">
               Call Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ active, completed, icon, label, time }: { active: boolean, completed: boolean, icon: React.ReactNode, label: string, time: string }) {
  return (
    <div className="flex items-start gap-6 relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all ${
        completed ? "bg-orange-600 text-white shadow-lg shadow-orange-200" : 
        active ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-gray-300"
      }`}>
        {completed ? <CheckCircle2 size={20} /> : icon}
      </div>
      <div className="pt-1">
        <h4 className={`font-bold ${active ? "text-gray-900" : "text-gray-300"}`}>{label}</h4>
        <p className={`text-sm font-medium ${active ? "text-gray-500" : "text-gray-200"}`}>{time}</p>
      </div>
      {/* Line connector logic would go here if needed */}
    </div>
  );
}
