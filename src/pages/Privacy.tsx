import React from "react";
import { Shield, Eye, Lock, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export default function Privacy() {
  return (
    <div className="pt-24 min-h-screen bg-[#fdfaf6] pb-20">
      <SEO 
        title="Privacy Policy" 
        description="Read the privacy policy of FoodNet. We are committed to protecting your personal data in our secure food delivery sandbox system." 
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-orange-950/5 border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block">Security Compliance</span>
              <h1 className="text-4xl font-black text-gray-950 tracking-tight">Privacy Policy</h1>
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
                1. System Sandbox and Purpose
              </h2>
              <p>
                Welcome to <strong>FoodNet</strong>, Kirehe's premier digital food delivery platform designed by Joshua Uwizeyimana. Please note that FoodNet operates as a secure, high-fidelity sandbox and e-learning portal for local dining and culinary streams in Kirehe, Rwanda. All transactions, real-time tracking routes, and interactive chef profiles are fully functional demo structures. We prioritize privacy control to ensure your testing environment is entirely safe.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                2. Information We Collect
              </h2>
              <p>
                In order to deliver an authentic digital food platform experience, we collect specific, restricted data streams during your sandbox interactions:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Profile Information:</strong> Name, username, and email address collected during account creation or synchronized via official Google Federated Sign-in.</li>
                <li><strong>Delivery Addresses:</strong> Mock delivery coordinates, district details, and street addresses necessary to simulate high-precision delivery routing, driver simulation, and Kirehe-based mapping tracks.</li>
                <li><strong>MoMo Transactions:</strong> Contact phone numbers entered for the interactive Mobile Money (MTN MoMo or Airtel Money) checkout simulator.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                3. Absolute Security Guard (No PIN Collection)
              </h2>
              <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-[2rem] flex items-start gap-4">
                <Lock className="text-orange-600 shrink-0 mt-1" size={24} />
                <p className="text-sm font-bold text-orange-950">
                  Critical Safety Directive: FoodNet Rwanda will NEVER ask you for your personal Mobile Money (MoMo) PINs, banking passwords, or credit card verification numbers anywhere inside this app. Our payment checkout calls standard, external, mock sandbox callbacks to simulate MTN / Airtel push prompts. If any form asks for private financial authorization keys, please discontinue immediately and alert our Security Desk.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                4. Data Storage and Synchronization
              </h2>
              <p>
                All account profiles and simulated orders are stored on secure Cloud Firestore instances, locked using enterprise-grade attribute-based security rules (ABAC). Your offline shopping carts utilize standard client-side `localStorage` keys for persistence and are synchronized immediately upon authenticated logins. You may request profile deletion at any time in your dashboard or by directly contacting the developer.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-600 rounded-full" />
                5. Compliance and Operator Contact
              </h2>
              <p>
                FoodNet Rwanda complies strictly with East African digital services standards. For privacy audits, data queries, or domain permission reports, please reach out to:
              </p>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100/80 font-bold space-y-2 text-sm text-gray-800">
                <p>Operator: Joshua Uwizeyimana</p>
                <p>Location: Kirehe District, Eastern Province, Rwanda</p>
                <p>Developer Contact: uwizeyimanajoshua@gmail.com</p>
                <p>Hotline (WhatsApp): +250 728 119 502</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
