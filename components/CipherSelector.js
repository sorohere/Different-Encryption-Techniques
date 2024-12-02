import React from 'react';
import { motion } from 'framer-motion';

const CipherSelector = ({ ciphers, selected, onSelect }) => {
  return (
    <div className="relative">
      <motion.select
        whileHover={{ scale: 1.02 }}
        value={selected}
        onChange={onSelect}
        className="w-full p-3 bg-white/70 border-2 border-gray-200 
          text-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 
          focus:border-transparent transition-all duration-300 cursor-pointer
          appearance-none font-medium relative z-10"
      >
        {ciphers.map((cipher) => (
          <option key={cipher} value={cipher} className="font-medium">
            {cipher.charAt(0).toUpperCase() + cipher.slice(1)} Cipher
          </option>
        ))}
      </motion.select>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none" />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-6 h-6 text-blue-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M8 9l4 4 4-4"
          />
        </svg>
      </div>
    </div>
  );
};

export default CipherSelector;