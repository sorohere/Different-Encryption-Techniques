import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const KeyInput = ({ cipher, keys, setKeys }) => {
  // Helper function to validate integer input
  const handleIntegerInput = (e, keyName) => {
    const value = e.target.value;
    // Allow empty string or integers only
    if (value === '' || /^[0-9]+$/.test(value)) {
      setKeys({ ...keys, [keyName]: value });
    } else {
      toast.error('Please enter numbers only');
    }
  };

  // Helper function to validate string input
  const handleStringInput = (e, keyName) => {
    const value = e.target.value;
    // Allow empty string or letters only
    if (value === '' || /^[a-zA-Z]+$/.test(value)) {
      setKeys({ ...keys, [keyName]: value });
    } else {
      toast.error('Please enter letters only');
    }
  };

  // Add these new helper functions
  const createEmptyMatrix = (size) => {
    return Array(size).fill().map(() => Array(size).fill(''));
  };

  const handleMatrixInput = (rowIndex, colIndex, value) => {
    if (value === '' || /^[0-9]+$/.test(value)) {
      const matrix = JSON.parse(keys.key1 || '[]');
      matrix[rowIndex][colIndex] = value === '' ? '' : parseInt(value);
      setKeys({ ...keys, key1: JSON.stringify(matrix) });
    }
  };

  const inputClassName = "w-full p-3 bg-blue-50/50 border-2 border-blue-100 \
    text-blue-900 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent \
    transition-all duration-300 text-sm sm:text-base font-medium \
    placeholder:text-blue-300 relative z-10";

  if (cipher === 'affine') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.key1}
          onChange={(e) => handleIntegerInput(e, 'key1')}
          placeholder="Key 1 (integer)"
          className={inputClassName}
        />
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.key2}
          onChange={(e) => handleIntegerInput(e, 'key2')}
          placeholder="Key 2 (integer)"
          className={inputClassName}
        />
      </div>
    );
  }

  // Modify the return statement to handle Hill Cipher
  if (cipher === 'hill') {
    return (
      <div className="space-y-4">
        <motion.input
          whileHover={{ scale: 1.02 }}
          type="text"
          value={keys.matrixSize || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || /^[0-9]+$/.test(value)) {
              const size = value === '' ? '' : parseInt(value);
              setKeys({
                matrixSize: value,
                key1: size ? JSON.stringify(createEmptyMatrix(size)) : ''
              });
            }
          }}
          placeholder="Enter matrix size (n for nxn matrix)"
          className={inputClassName}
        />
        
        {keys.matrixSize && parseInt(keys.matrixSize) > 0 && (
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-blue-800">Enter Key Matrix:</label>
            <div className="grid gap-2">
              {Array(parseInt(keys.matrixSize)).fill().map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {Array(parseInt(keys.matrixSize)).fill().map((_, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      className={`${inputClassName} w-16 text-center`}
                      value={JSON.parse(keys.key1 || '[]')[rowIndex]?.[colIndex] || ''}
                      onChange={(e) => handleMatrixInput(rowIndex, colIndex, e.target.value)}
                      placeholder="0"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.input
        whileHover={{ scale: 1.02 }}
        type="text"
        value={keys.key1}
        onChange={(e) => {
          if (['playfair', 'vigenere'].includes(cipher)) {
            handleStringInput(e, 'key1');
          } else {
            handleIntegerInput(e, 'key1');
          }
        }}
        placeholder={
          ['additive', 'multiplicative', 'autokey'].includes(cipher)
            ? "Enter integer key"
            : cipher === 'playfair' 
              ? "Enter letters only"
              : "Enter letters only"
        }
        className={inputClassName}
      />
      <div className="invisible">
        <input type="text" disabled className={inputClassName} />
      </div>
    </div>
  );
};

export default KeyInput;