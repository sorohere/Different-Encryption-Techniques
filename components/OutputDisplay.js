import React from 'react';
import { motion } from 'framer-motion';

const OutputDisplay = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border border-white/30 rounded-xl backdrop-blur-sm glow-effect"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-800">
        Encrypted Message
      </h3>
      <div className="p-4 bg-white/80 rounded-lg border-2 border-blue-100">
        <p className="text-blue-900 font-mono break-all tracking-wide">{text}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigator.clipboard.writeText(text)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm 
            hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2
            shadow-sm shadow-blue-500/20"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
            />
          </svg>
          Copy
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OutputDisplay;