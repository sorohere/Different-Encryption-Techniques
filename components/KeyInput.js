import React from 'react';
import { motion } from 'framer-motion';

const KeyInput = ({ cipher, keys, setKeys }) => {
  // Helper function to validate integer input
  const handleIntegerInput = (e, keyName) => {
    const value = e.target.value;
    // Allow empty string or integers only
    if (value === '' || /^[0-9]+$/.test(value)) {
      setKeys({ ...keys, [keyName]: value });
    }
  };

  const inputClassName = "w-full p-3 bg-white/70 border-2 border-gray-200 \
    text-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent \
    transition-all duration-300 text-sm sm:text-base font-medium \
    placeholder:text-gray-400";

  const inputWrapper = (input) => (
    <div className="relative">
      {input}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 pointer-events-none" />
    </div>
  );

  if (cipher === 'affine') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {inputWrapper(
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="text"
            value={keys.key1}
            onChange={(e) => handleIntegerInput(e, 'key1')}
            placeholder="Key 1 (integer)"
            className={inputClassName}
          />
        )}
        {inputWrapper(
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="text"
            value={keys.key2}
            onChange={(e) => handleIntegerInput(e, 'key2')}
            placeholder="Key 2 (integer)"
            className={inputClassName}
          />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {inputWrapper(
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.key1}
          onChange={['additive', 'multiplicative', 'autokey'].includes(cipher) 
            ? (e) => handleIntegerInput(e, 'key1')
            : (e) => setKeys({ ...keys, key1: e.target.value })}
          placeholder={
            ['additive', 'multiplicative', 'autokey'].includes(cipher)
              ? "Enter integer key"
              : cipher === 'playfair' 
                ? "Enter keyword"
                : "Enter key"
          }
          className={inputClassName}
        />
      )}
      <div className="invisible">
        <input className={inputClassName} disabled />
      </div>
    </div>
  );
};

export default KeyInput;