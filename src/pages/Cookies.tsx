import React from "react";
import { Cookie, Info, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export default function Cookies() {
  return (
    <div className="pt-24 min-h-screen bg-[#fdfaf6] pb-20">
      <SEO 
        title="Cookie Policy" 
        description="Learn more about Cookie Policy of FoodNet. Discover how we utilize localized secure keys to keep your digital platform experience safe and fluid." 
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-orange-950/5 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center">
              <Cookie size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">User Experience Keys</span>
              <h1 className="text-4xl font-black text-gray-950 tracking-tight">Cookie Policy</h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wider mb-8 flex items-center gap-2">
            <RefreshCw size={12} className="animate-spin" />
            Last Updated: May 25, 2026
          </p>

          <div className="space-y-10 text-gray-600 font-medium leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                1. What are Cookies & Local Storage?
              </h2>
              <p>
                Cookies and Local Storage coordinates represent standard, secure web technologies that store lightweight text files and state identifiers in your web browser. Local storage is critical for tracking custom configurations and persisting shopping arrays while navigating FoodNet.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                2. How We Utilize Cookies and Local State
              </h2>
              <p>
                We restrict local cookie utilities strictly to functional, security-mandated features:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Session Authentications:</strong> Secure Firebase JSON-Web-Tokens (JWT) are stored dynamically to authorize secure routes (such as checkout, real-time tracking, or admin settings) without demanding constant logins.</li>
                <li><strong>Language Selections:</strong> Remembers your preferred system language (English or Kinyarwanda) for subsequent visits.</li>
                <li><strong>Shopping Cart Retention:</strong> Retains items inside your local shopping tray in case you accidentally refresh the page or exit, ensuring you do not lose your selections.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                3. Third Party Elements
              </h2>
              <p>
                Our server relies strictly on Google Firebase Identity protocols to manage popups, redirect authentication keys, and maintain database session logs safely. We do not incorporate external advertising trackers or sell cookies to third-party marketing companies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                4. Managing Preferences
              </h2>
              <p>
                You hold absolute control over browser state. You can clear cookies or restrict local storage keys at any time via your browser settings. Be advised that clearing browser memory will wipe your localized shopping cart contents and sign you out of secure sessions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
