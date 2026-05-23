import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "unread",
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center">Get in Touch</h1>
        <p className="text-xl text-gray-500 mb-16 text-center max-w-2xl">
          Have questions about a stream, an order, or joining as a chef? We're here to help!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                <p className="text-lg font-bold truncate">uwizeyimanajoshua@gmail.com</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">MoMo Pay (MTN)</p>
                <p className="text-lg font-bold">0796542323</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Airtel Money</p>
                <p className="text-lg font-bold">0728119502</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kirehe Gateway</p>
                <p className="text-lg font-bold">Kirehe District, Rwanda</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900">Message Received!</h2>
                  <p className="text-gray-500 font-medium max-w-md">
                    Thank you for reaching out. Joshua's team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 border border-gray-100 font-medium" 
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 border border-gray-100 font-medium" 
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 border border-gray-100 font-medium" 
                    />
                    <textarea 
                      placeholder="Your Message" 
                      required
                      rows={5} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-orange-500/20 border border-gray-100 font-medium"
                    ></textarea>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transition-all hover:bg-orange-700 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
