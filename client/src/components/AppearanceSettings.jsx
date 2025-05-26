import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPalette, FaLayout, FaSun, FaMoon, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/slices/themeSlice";

const AppearanceSettings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
        border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm"
    >
      {/* Header with gradient background */}
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 
            dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg"
        >
          <FaPalette className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
            dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Appearance
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Customize your app's look and feel
          </p>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        {/* Theme Option */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 
            cursor-pointer transition-all duration-200 border border-gray-100 
            dark:border-gray-700 group relative overflow-hidden"
          onClick={toggleTheme}
        >
          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
              dark:from-blue-400/5 dark:to-purple-400/5 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300"
            initial={false}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <motion.span
                  whileHover={{ rotate: 15 }}
                  className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 
                    dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === "light" ? (
                        <FaSun className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <FaMoon className="w-4 h-4 text-blue-400" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.span>
                Theme
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Choose between light and dark mode
              </p>
            </div>
            <motion.div
              className="relative w-14 h-7 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 
                dark:from-gray-700 dark:to-gray-600 p-1 transition-colors duration-200 
                shadow-inner"
              animate={{
                background: theme === "dark" 
                  ? "linear-gradient(to right, #4B5563, #374151)" 
                  : "linear-gradient(to right, #E5E7EB, #D1D5DB)"
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-lg"
                animate={{
                  x: theme === "dark" ? 28 : 0,
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF"
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Layout Option */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 
            cursor-pointer transition-all duration-200 border border-gray-100 
            dark:border-gray-700 group relative overflow-hidden"
        >
          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
              dark:from-blue-400/5 dark:to-purple-400/5 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300"
            initial={false}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <motion.span
                  whileHover={{ rotate: 15 }}
                  className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 
                    dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm"
                >
                  <FaLayout className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.span>
                Layout
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Customize your dashboard layout
              </p>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 
                dark:group-hover:text-gray-300 transition-colors"
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings; 