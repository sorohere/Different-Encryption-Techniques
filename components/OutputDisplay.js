import React from 'react';
import { motion } from 'framer-motion';

const OutputDisplay = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg w-full"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-blue-700">Encrypted Message</h3>
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
          <p className="text-gray-800 font-mono break-all">{text}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigator.clipboard.writeText(text)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm 
              hover:bg-blue-700 transition-colors duration-300"
          >
            Copy to Clipboard
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OutputDisplay;