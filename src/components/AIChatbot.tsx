import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "support"; text: string }[]>([
    { role: "support", text: "Hello! I'm your FoodNet Support assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "support", text: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "support", text: "Sorry, I'm having trouble connecting to support right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp Button - Left Side */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <motion.a 
          href="https://wa.me/250728119502"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-green-500 text-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer transition-colors hover:bg-green-600"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </motion.a>
      </div>

      {/* Live Support Concierge - Right Side */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
            >
              {/* Header */}
              <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">FoodNet Support</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs opacity-80">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
              >
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                      msg.role === "user" 
                        ? "bg-orange-600 text-white rounded-tr-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                      <Loader2 className="animate-spin text-orange-600" size={18} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about FoodNet..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-full px-6 py-4 pr-14 outline-none focus:ring-2 ring-orange-500 font-medium transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    <Send size={18} />
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
          className={`w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center transition-colors ${
            isOpen ? "bg-gray-900" : "bg-orange-600"
          } text-white`}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </motion.button>
      </div>
    </>
  );
}
