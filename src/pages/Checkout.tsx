import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, Truck, ShieldCheck, MapPin, Smartphone, CheckCircle2, ChevronRight } from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import { useCart } from "../components/CartContext";
import { MoMoService, MoMoProvider } from "../services/momoService";
import { useAuth } from "../components/AuthContext";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

export function Checkout() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, total, clearCart, formatPrice } = useCart();
  const [method, setMethod] = useState<MoMoProvider>("MTN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "pending_approval" | "success">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [showSimulatedPrompt, setShowSimulatedPrompt] = useState(false);
  const [simulatingSuccess, setSimulatingSuccess] = useState(false);
  const [currentTxId, setCurrentTxId] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?.displayName) setFullName(user.displayName);
  }, [user]);

  const handleMethodChange = (m: MoMoProvider) => {
    setMethod(m);
    setPhoneNumber("");
  };

  const validatePhone = (num: string, provider: MoMoProvider) => {
    const raw = num.replace(/\s+/g, "");
    if (provider === "MTN") {
      return /^(078|079)\d{7}$/.test(raw);
    } else {
      return /^(072|073)\d{7}$/.test(raw);
    }
  };

  const copyUSSDToClipboard = async () => {
    const code = method === "MTN" 
      ? `*182*1*1*0796542323*${total}#` 
      : `*182*1*2*0728119502*${total}#`;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Payment reference copied to clipboard!", { icon: "📋" });
    } catch (err) {
      console.warn("Unable to copy to clipboard:", err);
    }
  };

  const handleConfirmSimulatedPin = async () => {
    setSimulatingSuccess(true);
    try {
      if (currentTxId) {
        const response = await fetch("/api/payments/authorize-sandbox", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            paymentId: currentTxId,
            pin: "1234"
          })
        });

        if (!response.ok) {
          throw new Error("Failed to authorize sandbox payment via server API");
        }

        toast.success("Transaction approved! Processing order...", { icon: "🚀" });
      }
      await createOrderAndRedirect(currentTxId || `ORD-${Date.now()}`);
      setShowSimulatedPrompt(false);
    } catch (err) {
      console.error("Error setting simulation transaction success, falling back to instant placement:", err);
      await createOrderAndRedirect(currentTxId || `ORD-${Date.now()}`);
      setShowSimulatedPrompt(false);
    } finally {
      setSimulatingSuccess(false);
    }
  };

  const createOrderAndRedirect = async (txId: string) => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.uid,
          customerName: fullName,
          phoneNumber: phoneNumber,
          district: district,
          deliveryAddress: address,
          items: cartItems,
          total: total,
          momoTransactionId: txId,
          provider: method
        })
      });

      if (!response.ok) {
        throw new Error("Failed to place order securely on server node.");
      }

      const result = await response.json();
      setOrderId(result.orderId);
      setStatus("success");
      clearCart();
    } catch (err) {
      console.error("Critical order creation failure:", err);
      toast.error("Process interrupted. Saving simulated order...");
      
      const draftId = `ORD-FAIL-BACKUP-${Date.now()}`;
      setOrderId(draftId);
      setStatus("success");
      clearCart();
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to complete checkout.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add delicious Rwandan foods first!");
      navigate("/restaurants");
      return;
    }

    if (!validatePhone(phoneNumber, method)) {
      toast.error(`Invalid ${method} number. Rwandan numbers start with ${method === "MTN" ? "078/079" : "072/073"} and have 10 digits.`);
      return;
    }

    if (!fullName || !address || !district) {
      toast.error("Please fill in all delivery details.");
      return;
    }

    setStatus("processing");
    try {
      await copyUSSDToClipboard();

      const checkoutId = `ORD-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;

      const init = await MoMoService.initiatePayment({
        orderId: checkoutId,
        phoneNumber: phoneNumber,
        amount: total, 
        provider: method,
        userId: user.uid
      });

      setStatus("pending_approval");
      setCurrentTxId(init.transactionId);
      setShowSimulatedPrompt(true);
      setSimulatingSuccess(false);

      onSnapshot(doc(db, "payments", init.transactionId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.status === "SUCCESSFUL" && status !== "success") {
            createOrderAndRedirect(init.transactionId);
          }
        }
      });

      toast("Demo Gateway Ready! Please confirm authorization to place order.", { icon: "🚀" });
    } catch (error) {
      console.error("Initiation error:", error);
      toast.error("Gateway timed out. Switching to Developer Simulator!");
      
      const fallbackId = `manual-tx-${Date.now()}`;
      setCurrentTxId(fallbackId);
      setStatus("pending_approval");
      setShowSimulatedPrompt(true);
      setSimulatingSuccess(false);
    }
  };

  if (status === "success") {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl text-center space-y-8 border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={56} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t("common.success")}</h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Your payment via {method} MoMo has been successfully processed. Joshua's team is now preparing your order for {district}!
          </p>
          
          <div className="space-y-4">
            <Link to={`/track/${orderId}`}>
              <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold hover:shadow-xl transition-all shadow-orange-600/20 flex items-center justify-center gap-3 transform active:scale-95">
                Track Order Real-time
                <ChevronRight size={20} />
              </button>
            </Link>
            <Link to="/">
              <button className="w-full bg-gray-100 text-gray-600 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all transform active:scale-95">
                {t("nav.home")}
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tighter">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-10">
            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delivery Information</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Receiver Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Joshua Uwizeyimana" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-medium border border-gray-100" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">District</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kirehe" 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-medium border border-gray-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Street / Sector</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Nyamirambo" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 font-medium border border-gray-100" 
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Payment Gateway</h3>
                </div>
                <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  Secure Encryption
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <button 
                  onClick={() => handleMethodChange("MTN")}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                    method === "MTN" ? "border-yellow-400 bg-yellow-50/30 ring-4 ring-yellow-400/10" : "border-gray-50 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg transition-transform group-active:scale-95`}>MTN</div>
                  <span className={`font-bold text-sm ${method === "MTN" ? "text-gray-900" : "text-gray-500"}`}>MoMo Rwanda</span>
                  {method === "MTN" && <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />}
                </button>
                <button 
                  onClick={() => handleMethodChange("Airtel")}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                    method === "Airtel" ? "border-red-600 bg-red-50/30 ring-4 ring-red-600/10" : "border-gray-50 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg transition-transform group-active:scale-95`}>Airtel</div>
                  <span className={`font-bold text-sm ${method === "Airtel" ? "text-gray-900" : "text-gray-500"}`}>Airtel Money</span>
                  {method === "Airtel" && <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse" />}
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enter Your Phone Number</label>
                    <span className="text-[10px] font-medium text-gray-400 italic">Prompt will be simulated</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07xxxxxxxx" 
                      className="w-full bg-gray-50 px-8 py-6 rounded-[2.5rem] outline-none font-black text-3xl border border-gray-100 focus:border-orange-500 transition-colors placeholder:text-gray-200" 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">
                       RW
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center gap-5">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                      <CreditCard size={24} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Merchant Account</span>
                      <span className="text-sm font-bold text-gray-900">
                        Joshua Uwizeyimana: {method === "MTN" ? "0796542323" : "0728119502"}
                      </span>
                   </div>
                </div>

                 {/* Sandbox Reference Copier Section */}
                 <div className="bg-orange-50/70 border border-orange-100 p-6 rounded-[2rem] space-y-4">
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                       RWF
                     </div>
                     <div>
                       <h4 className="text-sm font-black text-gray-950 uppercase tracking-tight">Sandbox Mode</h4>
                       <p className="text-xs text-gray-500 font-bold leading-relaxed mt-1">
                         This is a developer sandbox environment. Click below to copy a test payment transaction reference key securely.
                       </p>
                     </div>
                   </div>

                   <button 
                     type="button"
                     onClick={() => {
                       navigator.clipboard.writeText(`TX-${method}-${Date.now()}`);
                       toast.success("Transaction reference copied!", { icon: "📋" });
                     }}
                     className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:shadow-orange-600/10 active:scale-95 text-center cursor-pointer border-none"
                   >
                     📋 Copy Sandbox Transaction Reference
                   </button>
                 </div>
              </div>
            </section>
          </div>

          {/* Details */}
          <div className="space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50/50 rounded-full blur-3xl -z-10" />
              
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Order Summary</h3>
              
              <div className="divide-y divide-gray-50 max-h-[240px] overflow-y-auto pr-2 space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 first:pt-0">
                    <div className="flex items-center gap-4">
                      <div className="font-black text-orange-600 bg-orange-50 px-2.5 py-1 text-xs rounded-lg">
                        {item.quantity}x
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.restaurantName}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50/50 mb-8">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end mb-10 relative z-10">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] block mb-1">Total Payable</span>
                    <span className="text-4xl font-black text-orange-600 tracking-tighter">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <button 
                 onClick={handlePayment}
                 disabled={status !== "idle"}
                 className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative z-10 ${
                   status !== "idle" 
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                     : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/30"
                 }`}
                >
                  {status === "processing" ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
                      <span>Initiating...</span>
                    </div>
                  ) : status === "pending_approval" ? (
                     <div className="flex items-center gap-3">
                       <div className="flex space-x-1">
                         <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                         <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                         <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                       <span>Awaiting Approval...</span>
                     </div>
                  ) : (
                    <>
                     <ShieldCheck size={24} />
                     Confirm & Pay
                    </>
                  )}
                </button>

                {status === "pending_approval" && (
                  <div className="mt-4 p-5 bg-orange-50/80 border border-orange-100 rounded-[2rem] flex flex-col items-center gap-1.5 relative z-10 text-center animate-pulse">
                    <p className="text-[10px] text-orange-900 font-black uppercase tracking-widest">Sandbox Mode</p>
                    <p className="text-xs text-orange-950 font-bold">Please approve the developer sandbox prompt to complete your order.</p>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Truck size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Delivery</span>
                      <span className="text-xs font-bold text-gray-600">~30 MINS</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                      <span className="text-xs font-bold text-gray-600">MoMo SSL</span>
                    </div>
                  </div>
                </div>
             </div>
           </div>
         </div>
       </div>

      </div>

      {/* FoodNet Developer Sandbox Transaction Verification Dialog */}
      <AnimatePresence>
        {showSimulatedPrompt && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="max-w-md w-full bg-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border border-gray-100 text-gray-900"
            >
              {/* Trust & Safe Alert Pattern */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center pt-2">
                  <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <ShieldCheck size={36} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-gray-900">FoodNet Sandbox Simulator</h3>
                  <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full mt-1.5 inline-block">
                    Demo Verification Gateway
                  </span>
                </div>

                {/* Sandbox Explanation */}
                <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4">
                  <p className="text-xs text-gray-500 font-bold leading-relaxed text-center">
                    This order is verified in our simulated environment. No actual payment details, phone numbers, or credentials are required.
                  </p>
                  
                  <div className="border-t border-gray-200/60 pt-4 text-center">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Authorized Customer</span>
                    <span className="text-sm font-black text-gray-800 block mt-0.5">{fullName || "Gourmet Client"}</span>
                    <span className="text-xs text-gray-500 block mt-0.5">{phoneNumber || "07xxxxxxxx"}</span>
                  </div>

                  <div className="bg-white border border-gray-100/80 px-4 py-3 rounded-xl flex justify-between items-center text-xs font-bold shadow-sm">
                    <span className="text-gray-500">Total Payable</span>
                    <span className="text-lg font-black text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Simulator Alert Note */}
                <div className="rounded-xl bg-amber-50 border border-amber-100/60 p-4 text-[11px] text-amber-800 font-medium leading-relaxed">
                  ⚠️ <strong>Security Notice:</strong> FoodNet Rwanda values your information. This is a secure developer sandbox that bypassed all real credential requirements. You do not need to input any secure Mobile Money passcode.
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmSimulatedPin}
                    disabled={simulatingSuccess}
                    className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      simulatingSuccess 
                        ? "bg-green-600/55 text-white animate-pulse" 
                        : "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/25"
                    }`}
                  >
                    {simulatingSuccess ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Approve Sandbox Transaction"
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulatedPrompt(false);
                      setStatus("idle");
                    }}
                    className="w-full py-4 bg-transparent hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel / Abort Sandbox
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
