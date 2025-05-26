import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaSun, FaMoon, FaAdjust } from "react-icons/fa";
import { setTheme } from "../redux/slices/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 
        dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl 
        transition-all duration-300 overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
          dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 
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

      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 180 : 0,
            scale: theme === "dark" ? 1.2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="text-gray-700 dark:text-gray-300"
        >
          {theme === "light" ? (
            <FaSun className="w-5 h-5 transform transition-transform duration-300 
              group-hover:rotate-45 group-hover:text-yellow-500" />
          ) : (
            <FaMoon className="w-5 h-5 transform transition-transform duration-300 
              group-hover:rotate-45 group-hover:text-blue-400" />
          )}
        </motion.div>
      </div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full opacity-0"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />

      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
        bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 
        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </div>
    </motion.button>
  );
};

export default ThemeToggle; 