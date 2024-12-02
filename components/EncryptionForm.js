"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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

  const validateMultiplicativeKey = (key) => {
    // Function to calculate GCD
    const gcd = (a, b) => {
      while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    };

    const numKey = parseInt(key);
    if (gcd(numKey, 26) !== 1) {
      return false;
    }
    return true;
  };

  const handleEncrypt = () => {
    // Validate message
    if (!message.trim()) {
      toast.error('Please enter a message to encrypt');
      return;
    }

    // Validate keys based on cipher type
    if (cipher === 'affine') {
      if (!keys.key1 || !keys.key2) {
        toast.error('Please enter both keys for Affine cipher');
        return;
      }
      if (!validateMultiplicativeKey(keys.key1)) {
        toast.error('First key must be coprime with 26 for Affine cipher');
        return;
      }
    } else if (cipher === 'multiplicative') {
      if (!keys.key1) {
        toast.error('Please enter a key');
        return;
      }
      if (!validateMultiplicativeKey(keys.key1)) {
        toast.error('Key must be coprime with 26 for Multiplicative cipher');
        return;
      }
    } else if (['additive', 'autokey', 'playfair', 'vigenere'].includes(cipher)) {
      if (!keys.key1) {
        toast.error('Please enter a key');
        return;
      }
    }

    // If all validations pass, proceed with encryption
    let encryptedText = '';
    try {
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
      toast.success('Message encrypted successfully!');
    } catch (error) {
      toast.error(error.message || 'Encryption failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 sm:p-6 md:p-8 relative z-10"
    >
      <div className="w-full max-w-[500px] mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-morphism w-full p-6 sm:p-8 rounded-2xl relative"
        >
          <motion.h2 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r 
              from-blue-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-lg"
          >
            Encryption Wizard
          </motion.h2>

          <div className="space-y-8">
            <motion.div
              className="group glow-effect"
            >
              <label className="block text-sm font-semibold mb-2 text-blue-800">
                Message to Encrypt
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message here..."
                className="w-full p-4 rounded-xl min-h-[100px] resize-none
                  bg-blue-50/50 border-2 border-blue-100
                  placeholder:text-blue-300 text-blue-900
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  transition-all duration-300 font-medium"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
            >
              <label className="block text-sm font-semibold mb-2 text-blue-800">
                Select Cipher Method
              </label>
              <CipherSelector
                ciphers={ciphers}
                selected={cipher}
                onSelect={handleCipherChange}
              />
            </motion.div>

            <motion.div
              className="space-y-2"
            >
              <label className="block text-sm font-semibold mb-2 text-blue-800">
                Enter Key
              </label>
              <KeyInput cipher={cipher} keys={keys} setKeys={setKeys} />
            </motion.div>

            <motion.button
              onClick={handleEncrypt}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 
                text-white font-semibold rounded-xl relative overflow-hidden group
                shadow-lg shadow-blue-500/20"
            >
              <span className="relative text-lg">Encrypt Message</span>
            </motion.button>
          </div>

          {result && (
            <OutputDisplay 
              text={result} 
              originalText={message}
              cipher={cipher}
              keys={keys}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EncryptionForm;