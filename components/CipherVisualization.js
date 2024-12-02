"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

const CipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // Animation speed in ms

  const plaintext = searchParams.get('text') || '';
  const key = parseInt(searchParams.get('key')) || 0;

  const steps = plaintext.split('').map((char, index) => {
    if (char.match(/[a-zA-Z]/)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      const shifted = (code - offset + key) % 26;
      const newChar = String.fromCharCode(shifted + offset);

      return {
        original: char,
        shifted: newChar,
        calculation: `${char} (${code - offset}) + ${key} ≡ ${code - offset+ key}(mod 26) ≡ ${shifted} ≡ ${newChar}`
      };
    }
    return { original: char, shifted: char, calculation: 'Non-alphabetic character' };
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
        Additive Cipher Visualization
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600 mb-2">Plaintext:</p>
              <p className="font-mono bg-blue-50 p-2 rounded break-all whitespace-pre-wrap min-h-[40px]">
                {plaintext}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-2">Key:</p>
              <p className="font-mono bg-blue-50 p-2 rounded">{key}</p>
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
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded 
                      ${index === currentStep ? 'bg-blue-500 text-white' : 'bg-blue-50'}`}
                  >
                    {step.original}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <p className="text-sm text-blue-600 mb-2 text-center">Encrypted</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
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

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ForwardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const BackwardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default CipherVisualization; 