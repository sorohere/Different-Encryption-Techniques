"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CipherSelector from './CipherSelector';
import KeyInput from './KeyInput';
import OutputDisplay from './OutputDisplay';
import { hillCipherEncrypt } from '../utils/hillCipher';
import { encrypt as additiveEncrypt } from '../utils/additiveCipher';
import { encrypt as multiplicativeEncrypt } from '../utils/multiplicativeCipher';
import { encrypt as affineEncrypt } from '../utils/affineCipher';
import { encrypt as autokeyEncrypt } from '../utils/autokeyCipher';
import { encrypt as playfairEncrypt } from '../utils/playfairCipher';
import { encrypt as vigenereEncrypt } from '../utils/vigenereCipher';
import { encrypt as railFenceEncrypt } from '../utils/railFenceCipher';
import { encrypt as keylessTransformationEncrypt } from '../utils/keylessTransformationCipher';
import { Lock, MessageCircle, Key, Shield, Sparkles, Send, KeyRound } from 'lucide-react';

const ciphers = [
  'additive',
  'multiplicative',
  'affine',
  'autokey',
  'playfair',
  'vigenere',
  'hill',
  'railfence',
  'keylessTransformation'
];

const EncryptionForm = () => {
  const [message, setMessage] = useState('');
  const [cipher, setCipher] = useState('additive');
  const [keys, setKeys] = useState({ key1: '', key2: '' });
  const [result, setResult] = useState('');
  const [keyMatrix, setKeyMatrix] = useState('');

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
    } else if (cipher === 'keylessTransformation') {
      if (!keys.key1 || isNaN(keys.key1) || parseInt(keys.key1) < 2) {
        toast.error('Please enter a valid number of columns (minimum 2)');
        return;
      }
    }

    // If all validations pass, proceed with encryption
    let encryptedText = '';
    try {
      let encrypted = '';
      if (cipher === 'additive') {
        encrypted = additiveEncrypt(message, parseInt(keys.key1));
      } else if (cipher === 'multiplicative') {
        encrypted = multiplicativeEncrypt(message, parseInt(keys.key1));
      } else if (cipher === 'affine') {
        encrypted = affineEncrypt(message, parseInt(keys.key1), parseInt(keys.key2));
      } else if (cipher === 'autokey') {
        encrypted = autokeyEncrypt(message, keys.key1);
      } else if (cipher === 'playfair') {
        encrypted = playfairEncrypt(message, keys.key1);
      } else if (cipher === 'vigenere') {
        encrypted = vigenereEncrypt(message, keys.key1);
      } else if (cipher === 'hill') {
        const matrixSize = parseInt(keys.matrixSize);
        const keyMatrix = JSON.parse(keys.key1);
        encrypted = hillCipherEncrypt(message, keyMatrix);
        setKeyMatrix(keyMatrix);
      } else if (cipher === 'railfence') {
        encrypted = railFenceEncrypt(message);
      } else if (cipher === 'keylessTransformation') {
        encrypted = keylessTransformationEncrypt(message, parseInt(keys.key1));
      }
      setResult(encrypted);
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
          className="w-[500px] p-6 sm:p-8 rounded-2xl relative 
            bg-gradient-to-br from-violet-100/90 via-indigo-100/90 to-blue-100/90 
            backdrop-blur-md border border-violet-200 shadow-2xl"
        >
          <motion.div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-violet-600" />
            <motion.h2 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl sm:text-4xl font-bold text-center 
                bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 
                text-transparent bg-clip-text drop-shadow-lg"
            >
              Encryption Wizard
            </motion.h2>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </motion.div>

          <div className="space-y-8">
            <motion.div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-violet-700">
                <MessageCircle className="w-4 h-4" />
                Message to Encrypt
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message here..."
                className="w-full p-4 rounded-xl min-h-[100px] resize-none
                  bg-white/80 border-2 border-violet-200
                  placeholder:text-violet-400 text-violet-900
                  focus:ring-2 focus:ring-violet-400 focus:border-transparent
                  transition-all duration-300 font-medium shadow-inner
                  hover:bg-white/90"
              />
            </motion.div>

            <motion.div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-violet-700">
                <KeyRound className="w-4 h-4" />
                Select Cipher Method
              </label>
              <CipherSelector
                ciphers={ciphers}
                selected={cipher}
                onSelect={handleCipherChange}
                className="bg-white/80 border-violet-200 text-violet-900
                  focus:ring-violet-400 hover:bg-white/90"
              />
            </motion.div>

            {cipher !== 'railfence' && (
              <motion.div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-violet-700">
                  <Key className="w-4 h-4" />
                  {cipher === 'keylessTransformation' ? 'Enter number of columns' : 'Enter Key'}
                </label>
                <KeyInput 
                  cipher={cipher} 
                  keys={keys} 
                  setKeys={setKeys}
                  className="bg-white/80 border-violet-200 text-violet-900
                    focus:ring-violet-400 hover:bg-white/90"
                />
              </motion.div>
            )}

            <motion.button
              onClick={handleEncrypt}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 
                text-white font-semibold rounded-xl relative overflow-hidden group
                shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-indigo-400/20 to-blue-400/20 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-lg flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Encrypt Message
                <Send className="w-5 h-5" />
              </span>
            </motion.button>
          </div>

          {result && (
            <OutputDisplay 
              text={result} 
              originalText={message}
              cipher={cipher}
              keys={cipher === 'hill' ? keyMatrix : keys}
              className="bg-white/80 border-violet-200 text-violet-900
                shadow-lg rounded-xl p-6 mt-8"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EncryptionForm;