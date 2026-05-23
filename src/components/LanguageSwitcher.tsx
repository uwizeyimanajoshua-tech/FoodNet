import React from "react";
import { useLanguage, Language } from "./LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
];

interface LanguageSwitcherProps {
  isScrolled: boolean;
  isHome: boolean;
}

export function LanguageSwitcher({ isScrolled, isHome }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (code: string) => {
    setLanguage(code as Language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${
          !isScrolled && isHome
            ? "bg-white/10 border-white/20 text-white"
            : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Globe size={16} />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
          {currentLanguage.code}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[70] overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${
                    lang.code === language
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-orange-50/50 hover:text-orange-600"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <div className="ml-auto w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
