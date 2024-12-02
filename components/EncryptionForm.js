"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CipherSelector from './CipherSelector';
import KeyInput from './KeyInput';
import OutputDisplay from './OutputDisplay';
import { encrypt as additiveEncrypt } from '../utils/additiveCipher';
import { encrypt as multiplicativeEncrypt } from '../utils/multiplicativeCipher';
import { encrypt as affineEncrypt } from '../utils/affineCipher';
import { encrypt as autokeyEncrypt } from '../utils/autokeyCipher';
import { encrypt as playfairEncrypt } from '../utils/playfairCipher';
import { encrypt as vigenereEncrypt } from '../utils/vigenereCipher';

const ciphers = [
  'additive',
  'multiplicative',
  'affine',
  'autokey',
  'playfair',
  'vigenere',
];

const EncryptionForm = () => {
  const [message, setMessage] = useState('');
  const [cipher, setCipher] = useState('additive');
  const [keys, setKeys] = useState({ key1: '', key2: '' });
  const [result, setResult] = useState('');

  const handleCipherChange = (e) => {
    setCipher(e.target.value);
    setKeys({ key1: '', key2: '' });
    setResult('');
  };

  const handleEncrypt = () => {
    let encryptedText = '';
    switch (cipher) {
      case 'additive':
        encryptedText = additiveEncrypt(message, parseInt(keys.key1));
        break;
      case 'multiplicative':
        encryptedText = multiplicativeEncrypt(message, parseInt(keys.key1));
        break;
      case 'affine':
        encryptedText = affineEncrypt(message, parseInt(keys.key1), parseInt(keys.key2));
        break;
      case 'autokey':
        encryptedText = autokeyEncrypt(message, keys.key1);
        break;
      case 'playfair':
        encryptedText = playfairEncrypt(message, keys.key1);
        break;
      case 'vigenere':
        encryptedText = vigenereEncrypt(message, keys.key1);
        break;
      default:
        break;
    }
    setResult(encryptedText);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="w-full max-w-[500px] mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-white/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
          >
            Encryption Wizard
          </motion.h2>

          <div className="space-y-8">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="group relative"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Message to Encrypt
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your secret message here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl transition-all duration-300 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]
                    bg-white/70 backdrop-blur-sm resize-none
                    placeholder:text-gray-400 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Select Cipher Method
              </label>
              <CipherSelector
                ciphers={ciphers}
                selected={cipher}
                onSelect={handleCipherChange}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Enter Key
              </label>
              <KeyInput cipher={cipher} keys={keys} setKeys={setKeys} />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEncrypt}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 
                text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-0.5
                text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-indigo-700/50 
                transform group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative">Encrypt Message</span>
            </motion.button>
          </div>

          {result && <OutputDisplay text={result} />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EncryptionForm;