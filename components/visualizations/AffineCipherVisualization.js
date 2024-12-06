"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayIcon, PauseIcon, ResetIcon, CloseIcon, ForwardIcon, BackwardIcon } from '../icons/VisualizationIcons';

const AffineCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const plaintext = searchParams.get('text') || '';
  const key1 = parseInt(searchParams.get('key1')) || 0;
  const key2 = parseInt(searchParams.get('key2')) || 0;

  const steps = plaintext.split('').map((char, index) => {
    if (char.match(/[a-zA-Z]/)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      const position = code - offset;
      const multiplied = (position * key1) % 26;
      const shifted = (multiplied + key2) % 26;
      const newChar = String.fromCharCode(shifted + offset);

      return {
        original: char,
        multiplied: String.fromCharCode(multiplied + offset),
        shifted: newChar,
        calculation: `${char} (${position}) × ${key1} ≡ ${multiplied} (mod 26) + ${key2} ≡ ${shifted} ≡ ${newChar}`
      };
    }
    return { 
      original: char, 
      multiplied: char, 
      shifted: char, 
      calculation: 'Non-alphabetic character' 
    };
  });

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleClose = () => {
    router.back();
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-8 relative">
      <button
        onClick={handleClose}
        className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 
          transition-colors"
        aria-label="Close visualization"
      >
        <CloseIcon />
      </button>

      <h2 className="text-2xl font-bold text-center text-blue-800">
        Affine Cipher Visualization
      </h2>

      <div className="flex justify-center items-center space-x-4 mb-8">
        <button
          onClick={handleStepBackward}
          disabled={currentStep === 0}
          className={`p-2 rounded-lg transition-colors flex items-center space-x-2
            ${currentStep === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          <BackwardIcon />
        </button>

        <button
          onClick={handlePlayPause}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors flex items-center space-x-2"
        >
          {isPlaying ? (
            <>
              <PauseIcon /> <span>Pause</span>
            </>
          ) : (
            <>
              <PlayIcon /> <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={handleStepForward}
          disabled={currentStep === steps.length - 1}
          className={`p-2 rounded-lg transition-colors flex items-center space-x-2
            ${currentStep === steps.length - 1 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          <ForwardIcon />
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
            transition-colors flex items-center space-x-2"
        >
          <ResetIcon /> <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Input</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600 mb-2">Plaintext:</p>
              <p className="font-mono bg-blue-50 p-2 rounded break-all whitespace-pre-wrap min-h-[40px]">
                {plaintext}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-2">Key 1 (multiplicative):</p>
              <p className="font-mono bg-blue-50 p-2 rounded">{key1}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-2">Key 2 (additive):</p>
              <p className="font-mono bg-blue-50 p-2 rounded">{key2}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Visualization</h3>
          <div className="flex flex-col items-center space-y-6 mb-6">
            <div className="w-full">
              <p className="text-sm text-blue-600 mb-2 text-center">Original</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={`original-${index}`}
                    className={`w-8 h-8 flex items-center justify-center rounded 
                      ${index === currentStep ? 'bg-blue-500 text-white' : 'bg-blue-50'}`}
                  >
                    {step.original}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm text-blue-600 mb-2 text-center">After Multiplication</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={`multiplied-${index}`}
                    className={`w-8 h-8 flex items-center justify-center rounded 
                      ${index === currentStep ? 'bg-purple-500 text-white' : 'bg-blue-50'}`}
                  >
                    {index <= currentStep ? step.multiplied : '?'}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm text-blue-600 mb-2 text-center">Final (After Addition)</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={`shifted-${index}`}
                    className={`w-8 h-8 flex items-center justify-center rounded 
                      ${index === currentStep ? 'bg-green-500 text-white' : 'bg-blue-50'}`}
                  >
                    {index <= currentStep ? step.shifted : '?'}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-50 p-4 rounded-lg font-mono text-sm text-center 
                whitespace-pre-wrap break-all"
            >
              {steps[currentStep]?.calculation}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AffineCipherVisualization; 