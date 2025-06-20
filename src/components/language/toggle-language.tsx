"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "@/../i18n";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "vi" : "en";
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
  };

  const backgroundStyle = {
    vi: "bg-[url('/images/Flag_of_Vietnam.png')]",
    en: "bg-[url('/images/Flag_of_the_United_Kingdom.png')]",
  };

  return (
    <div className="transition-colors duration-500">
      <div className="flex items-center justify-center">
        <motion.button
          onClick={toggleLanguage}
          className={`relative w-20 h-10 rounded-full bg-cover bg-center p-1 border border-gray-300 shadow-inner overflow-hidden ${
            backgroundStyle[language as "vi" | "en"]
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-white shadow-md"
            animate={{
              x: language === "vi" ? 40 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        </motion.button>
      </div>
    </div>
  );
}
