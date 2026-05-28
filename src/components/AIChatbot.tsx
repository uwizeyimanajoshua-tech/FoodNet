import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Headphones, Sparkles, BookOpen, CreditCard, Flame, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "support";
  text: string;
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "support", 
      text: "Muraho! 👋 Welcome to FoodNet Rwanda AI Support. I am your virtual culinary assistant. Ask me anything about our local dishes (Isombe, Akabenz), our live chef streams, or how to place your order!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Generates highly accurate local responses if the backend is unreachable or hosted on Netlify
  const getLocalResponse = (message: string): string => {
    const query = message.toLowerCase();

    if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("muraho") || query.includes("kaze")) {
      return "Greetings! (Kaze neza!) How can the FoodNet team assist you today? You can ask me about our menu, live streams, or fast delivery service!";
    }

    if (query.includes("menu") || query.includes("food") || query.includes("dish") || query.includes("delicac") || query.includes("eat") || query.includes("price") || query.includes("isombe") || query.includes("akabenz") || query.includes("tilapia") || query.includes("brochette")) {
      return "🍲 Here are our premium, authentic Rwandan menu highlights available to order:\n\n- **Isombe with Rice (4,500 RWF)**: Tenderly pounded cassava leaves prepared matching royal traditions.\n- **Kigali Grilled Tilapia (8,000 RWF)**: Large, fresh local lake catch seasoned with rich spices.\n- **Brochette Platter (6,500 RWF)**: Perfectly charred tender goat or beef skewers accompanied by potatoes.\n- **Akabenz pork special (5,000 RWF)**: A famous and flavorful local roasted pork delicacy.\n\nYou can explore our full list in the **Restaurants** section!";
    }

    if (query.includes("how to order") || query.includes("place order") || query.includes("buy") || query.includes("cart") || query.includes("checkout")) {
      return "🛍️ Ordering on FoodNet is quick and transparent:\n1. Browse our verified menu items under the **Restaurants / Food** section.\n2. Tap 'Add to Cart' on your preferred delicacies.\n3. Open your **Cart** from the upper navigation bar.\n4. Complete your details and select your preferred Mobile Money provider (MTN/Airtel) to finish checkout!";
    }

    if (query.includes("payment") || query.includes("pay") || query.includes("momo") || query.includes("airtel") || query.includes("money") || query.includes("orange") || query.includes("card") || query.includes("cash")) {
      return "💳 We support instantaneous Mobile Money payments in Rwanda:\n- **MTN Mobile Money**: Send directly to our merchant number **0796542323**.\n- **Airtel Money**: Send directly to **0728119502**.\n\nTransactions are securely handled, and our system supports real-time verification so your order starts preparation instantly.";
    }

    if (query.includes("delivery") || query.includes("deliver") || query.includes("location") || query.includes("where") || query.includes("kirehe") || query.includes("kigali") || query.includes("office")) {
      return "🚚 FoodNet delivers express across **Kirehe District** and key areas in **Kigali**! Once your order gets dispatched, you can view its progress in real-time via our integrated Google Maps interface inside your dashboard.";
    }

    if (query.includes("stream") || query.includes("live") || query.includes("chef") || query.includes("karisa") || query.includes("nk") || query.includes("watch") || query.includes("cook")) {
      return "🎥 Experience true culinary theater! Master Chef **N. Karisa (Chef NK)** hosts interactive **Live Streams** on our platform. You can watch him cook Rwandan specialties in real-time, interact in chat, and click to order the precise list of ingredients he is using! Head to the **Streams** tab to see who is live.";
    }

    if (query.includes("creator") || query.includes("founder") || query.includes("joshua") || query.includes("uwizeyimana") || query.includes("who made")) {
      return "👨‍💻 FoodNet Rwanda was founded and engineered by **Joshua Uwizeyimana**, bridging the gap between world-class culinary masterclasses and local food enthusiasts in Kirehe.";
    }

    if (query.includes("admin") || query.includes("dashboard") || query.includes("login") || query.includes("pass")) {
      return "🔐 If you are looking for local testing credentials:\n- **Admin Username**: joshua\n- **Password**: joshua@123\n\nYou can access the portal via the Login screen or Support routes to manage live listings, streams, and system orders.";
    }

    if (query.includes("contact") || query.includes("help") || query.includes("email") || query.includes("phone") || query.includes("whatsapp")) {
      return "📞 Need detailed physical help? Contact us anytime:\n- **WhatsApp**: +250 728 119 502\n- **Email**: uwizeyimanajoshua@gmail.com\n- **Support Desk**: Located in Kirehe, Eastern Province, Rwanda.";
    }

    return "✨ Thank you for using FoodNet AI Concierge! I'm here to ensure you have a seamless dining experience. You can ask me about our fresh menu (Isombe, Akabenz), our Live Chef Masterclasses, or supported Mobile Money options!";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages.map(m => ({ role: m.role === "user" ? "user" : "model", text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error("Backend offline or non-express server");
      }

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: "support", text: data.text }]);
      } else {
        throw new Error("No text returned");
      }
    } catch (error) {
      console.warn("Using smart local fallback for FoodNet virtual support:", error);
      // Generate standard highly professional response with a fast realistic reading delay
      setTimeout(() => {
        const localReply = getLocalResponse(userMessage);
        setMessages((prev) => [...prev, { role: "support", text: localReply }]);
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  return (
    <>
      {/* WhatsApp Button - Left Side with rel="noopener noreferrer" for security */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <motion.a 
          href="https://wa.me/250728119502"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Chat on WhatsApp"
          className="w-16 h-16 bg-green-500 text-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-green-600 border border-green-400/20"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="https://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      </div>

      {/* Live Support Concierge - Right Side */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] md:w-[420px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100/80 flex flex-col overflow-hidden mb-4"
            >
              {/* Header */}
              <div className="bg-orange-600 p-6 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-xl -mr-10 -mt-10" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 select-none">
                    <span className="text-[10px] uppercase tracking-widest font-black leading-none text-orange-200">FoodNet</span>
                    <span className="text-sm font-black tracking-tight leading-none text-white">AI</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base tracking-tight">AI Concierge</h3>
                      <span className="bg-orange-500/30 text-orange-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-orange-400/20">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                      <span className="text-[11px] opacity-90 font-medium">Virtual support desk online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Container */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/80"
              >
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                  >
                    {msg.role === "support" && (
                      <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-orange-500/15">
                        AI
                      </div>
                    )}
                    <div className={`max-w-[78%] p-4 rounded-[1.5rem] text-sm leading-relaxed font-medium whitespace-pre-line ${
                      msg.role === "user" 
                        ? "bg-orange-600 text-white rounded-br-none shadow-md" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      AI
                    </div>
                    <div className="bg-white px-5 py-3.5 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="animate-spin text-orange-600" size={16} />
                        <span className="text-xs text-gray-400 font-bold tracking-wide">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-6 py-3 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                <button 
                  onClick={() => handleQuickAction("What on the menu today?")}
                  className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-all flex items-center gap-1"
                >
                  <BookOpen size={13} />
                  See Menu
                </button>
                <button 
                  onClick={() => handleQuickAction("How can I pay via Mobile Money?")}
                  className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-all flex items-center gap-1"
                >
                  <CreditCard size={13} />
                  Payments
                </button>
                <button 
                  onClick={() => handleQuickAction("Watch live masterclass")}
                  className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-all flex items-center gap-1"
                >
                  <Flame size={13} />
                  Live Stream
                </button>
                <button 
                  onClick={() => handleQuickAction("Do you deliver to Kigali?")}
                  className="bg-gray-100 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-all flex items-center gap-1"
                >
                  <MapPin size={13} />
                  Delivery Locations
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about FoodNet..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-full px-6 py-4 pr-14 outline-none focus:ring-2 ring-orange-500 font-medium text-sm transition-all text-gray-800"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center transition-colors relative border border-transparent ${
            isOpen ? "bg-gray-900 border-gray-800" : "bg-orange-600 border-orange-500/20"
          } text-white`}
          title="Open AI support chat"
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <>
              <MessageSquare size={28} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <Sparkles size={10} className="text-white fill-current" />
              </div>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
