import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-950 text-gray-300 pt-20 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="foodnet.png" 
                alt="FoodNet Rwanda Logo" 
                className="h-16 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-gray-400 font-medium leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all transform hover:scale-110">
                <Facebook size={20} />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all transform hover:scale-110">
                <Twitter size={20} />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all transform hover:scale-110">
                <Instagram size={20} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8 text-gray-500">{t("footer.navigation")}</h3>
            <ul className="space-y-4 font-bold">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">{t("nav.home")}</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/restaurants" className="hover:text-orange-500 transition-colors">{t("nav.restaurants")}</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8 text-gray-500">{t("footer.legal")}</h3>
            <ul className="space-y-4 font-bold">
              <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">{t("footer.terms")}</Link></li>
              <li><Link to="/cookies" className="hover:text-orange-500 transition-colors">{t("footer.cookies")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-8 text-gray-500">{t("footer.kireheOffice")}</h3>
            <ul className="space-y-6 font-bold">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-orange-600" size={20} />
                </div>
                <span className="text-gray-400">{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-4">
                <a href="https://wa.me/250728119502" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-orange-500 transition-colors w-full">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="text-orange-600" size={20} />
                  </div>
                  <span className="text-gray-400">WhatsApp: 0728119502</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-orange-600" size={20} />
                </div>
                <span className="text-gray-400">uwizeyimanajoshua@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            FoodNet © {new Date().getFullYear()} Joshua Uwizeyimana.
          </p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-600">
            <span>{t("footer.madeIn")}</span>
            <span>{t("footer.digitalPlatform")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
