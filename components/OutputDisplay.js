import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const OutputDisplay = ({ text, originalText, cipher, keys }) => {
  const router = useRouter();

  const handleVisualize = () => {
    if (cipher === 'additive') {
      router.push(`/visualize/additive?text=${encodeURIComponent(originalText)}&key=${keys.key1}`);
    } else if (cipher === 'multiplicative') {
      router.push(`/visualize/multiplicative?text=${encodeURIComponent(originalText)}&key=${keys.key1}`);
    } else if (cipher === 'affine') {
      router.push(`/visualize/affine?text=${encodeURIComponent(originalText)}&key1=${keys.key1}&key2=${keys.key2}`);
    } else if (cipher === 'autokey') {
      router.push(`/visualize/autokey?text=${encodeURIComponent(originalText)}&key=${keys.key1}`);
    } else if (cipher === 'vigenere') {
      router.push(`/visualize/vigenere?text=${encodeURIComponent(originalText)}&key=${keys.key1}`);
    } else if (cipher === 'playfair') {
      router.push(`/visualize/playfair?text=${encodeURIComponent(originalText)}&key=${keys.key1}`);
    } else if (cipher === 'hill') { 
      // For Hill cipher, keys is the actual matrix
      const keyMatrixString = encodeURIComponent(JSON.stringify(keys));
      router.push(`/visualize/hill?text=${encodeURIComponent(originalText)}&key=${keyMatrixString}`);
    } else if (cipher === 'railfence') {
      router.push(`/visualize/railfence?text=${encodeURIComponent(originalText)}`);
    } else if (cipher === 'keylessTransformation') {
      router.push(`/visualize/keylessTransformation?text=${encodeURIComponent(originalText)}&columns=${keys.key1}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50/30 border-2 border-blue-100 rounded-xl"
    >
      <h3 className="text-xl font-semibold mb-3 text-blue-800">
        Encrypted Message
      </h3>
      <div className="p-4 bg-white/80 rounded-lg border-2 border-blue-100">
        <p className="text-blue-900 font-mono break-all tracking-wide">{text}</p>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        {(cipher === 'additive' || cipher === 'multiplicative' || cipher === 'affine' || 
          cipher === 'autokey' || cipher === 'vigenere' || cipher === 'playfair' || cipher === 'hill' || 
          cipher === 'railfence' || cipher === 'keylessTransformation') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVisualize}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm 
              hover:bg-indigo-700 transition-colors flex items-center gap-2
              shadow-sm shadow-indigo-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Visualize
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigator.clipboard.writeText(text)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm 
            hover:bg-blue-700 transition-colors flex items-center gap-2
            shadow-sm shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OutputDisplay;