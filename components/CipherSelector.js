import React from 'react';
import { motion } from 'framer-motion';

const CipherSelector = ({ ciphers, selected, onSelect }) => {
  return (
    <div className="relative">
      <motion.select
        whileHover={{ scale: 1.02 }}
        value={selected}
        onChange={onSelect}
        className="w-full p-3 bg-blue-50/50 border-2 border-blue-100 
          text-blue-900 rounded-xl focus:ring-2 focus:ring-blue-400 
          focus:border-transparent transition-all duration-300 cursor-pointer
          appearance-none font-medium"
      >
        {ciphers.map((cipher) => (
          <option key={cipher} value={cipher} className="bg-white text-blue-900 font-medium">
            {cipher.charAt(0).toUpperCase() + cipher.slice(1)} Cipher
          </option>
        ))}
      </motion.select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-5 h-5 text-blue-600" 
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