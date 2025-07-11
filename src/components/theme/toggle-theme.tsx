"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function Component() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <div className={`transition-colors duration-500`}>
      <div className="flex items-center justify-center">
        <div className="text-center space-y-8">
          <motion.button
            onClick={toggleTheme}
            className={`relative w-20 h-10 rounded-full p-1 transition-colors duration-300 ${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-blue-600"
                : "bg-gradient-to-r from-yellow-400 to-orange-500"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
              animate={{
                x: isDark ? 40 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <motion.div
                animate={{ rotate: isDark ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? (
                  <Moon className="w-4 h-4 text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-500" />
                )}
              </motion.div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-between px-2">
              <Sun
                className={`w-4 h-4 transition-opacity duration-300 ${
                  isDark ? "opacity-30" : "opacity-70"
                } text-white`}
              />
              <Moon
                className={`w-4 h-4 transition-opacity duration-300 ${
                  isDark ? "opacity-0" : "opacity-100"
                } text-white`}
              />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
