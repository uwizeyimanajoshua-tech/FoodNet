import React from "react";
import { Scale, FileText, Globe, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export default function Terms() {
  return (
    <div className="pt-24 min-h-screen bg-[#fdfaf6] pb-20">
      <SEO 
        title="Terms of Service" 
        description="Review the terms and conditions of FoodNet. Discover our service boundaries and security compliance frameworks." 
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-orange-950/5 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center">
              <Scale size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Core Framework</span>
              <h1 className="text-4xl font-black text-gray-950 tracking-tight">Terms of Service</h1>
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
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or utilizing the <strong>FoodNet</strong> platform (referred to as "FoodNet", "the App", or "Service"), you agree to be bound by these Terms of Service, all applicable laws, and local digital regulations in Rwanda. If you do not accept these provisions, you should discontinue using our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                2. Sandbox Nature & Non-Commercial Limits
              </h2>
              <p>
                FoodNet is a high-fidelity sandbox application designed for showcasing advanced digital menu systems, live culinary stream networks, and map-based tracking mechanics in Kirehe, Rwanda. Please take note of the following rules:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Interactive Mocking:</strong> All menu elements, order simulations, chef profiles, and payments are interactive simulators. No physical items will be baked or delivered without custom manual coordination.</li>
                <li><strong>Mock Money Systems:</strong> Any MTN MoMo or Airtel Money references represent secure, offline sandboxed payment operations used strictly for evaluation. No real currency is withdrawn.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                3. User Accounts and Verification Keys
              </h2>
              <p>
                When creating an account or logging in using Google federated credentials, you must provide valid, accurate registration information. You are solely responsible for maintaining the privacy of your account keys, session authentication tokens, and credentials. You must contact Joshua Uwizeyimana immediately if you notice any suspicious movements on your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                4. Live Streams and Community Comments
              </h2>
              <p>
                All users must respect community safety when sending live comments under interactive chef sessions. We strictly prohibit harassment, abusive wording, political conflicts, or spamming links. The administration (Joshua Uwizeyimana) reserves the absolute right to delete comments or delete accounts violating these safety principles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                5. Intellectual Property
              </h2>
              <p>
                All elements of FoodNet, including design structures, branding icons, source animations, interactive map coordinates, and logos, are protected by local Rwandan copyright and trademark rights. Unsanctioned copying or distribution is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                6. Governing Law
              </h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the Republic of Rwanda, without regard to conflict of law principles. Any legal updates or inquiries can be directed to the regional developer desk in Kirehe District.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
