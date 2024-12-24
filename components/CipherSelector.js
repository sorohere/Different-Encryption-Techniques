import React from 'react';
import { motion } from 'framer-motion';

const CipherSelector = ({ ciphers, selected, onSelect }) => {
  return (
    <div className="relative">
      <motion.select
        whileHover={{ scale: 1.02 }}
        value={selected}
        onChange={onSelect}
        className="w-full p-3 bg-white/80 border-2 border-violet-200 
          text-violet-900 rounded-xl focus:ring-2 focus:ring-violet-400 
          focus:border-transparent transition-all duration-300 cursor-pointer
          appearance-none font-medium hover:bg-white/90"
      >
        {ciphers.map((cipher) => (
          <option key={cipher} value={cipher} className="bg-white text-violet-900 font-medium">
            {cipher.charAt(0).toUpperCase() + cipher.slice(1)} Cipher
          </option>
        ))}
      </motion.select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-5 h-5 text-violet-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CipherSelector;