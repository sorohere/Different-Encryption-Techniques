"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayIcon, PauseIcon, ResetIcon, CloseIcon, ForwardIcon, BackwardIcon } from '../icons/VisualizationIcons';

const AutokeyCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const plaintext = searchParams.get('text') || '';
  const initialKey = parseInt(searchParams.get('key')) || 0;
  
  const firstKeyChar = String.fromCharCode((initialKey % 26) + 65);

  const steps = plaintext.split('').map((char, index) => {
    if (char.match(/[a-zA-Z]/)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      const position = code - offset;
      
      let prevLetterIndex = index - 1;
      while (prevLetterIndex >= 0 && !plaintext[prevLetterIndex].match(/[a-zA-Z]/)) {
        prevLetterIndex--;
      }
      
      const keyChar = index === 0 || prevLetterIndex < 0 
        ? firstKeyChar 
        : plaintext[prevLetterIndex].toUpperCase();
      const keyCode = keyChar.charCodeAt(0) - 65;
      const shifted = (position + keyCode) % 26;
      const newChar = String.fromCharCode(shifted + offset);

      return {
        original: char,
        keyChar: keyChar,
        shifted: newChar,
        calculation: `${char} (${position}) + ${keyChar} (${keyCode}) ≡ ${position + keyCode} (mod 26) ≡ ${shifted} ≡ ${newChar}`
      };
    }
    return { 
      original: char, 
      keyChar: ' ',
      shifted: char, 
      calculation: 'Space or non-alphabetic character' 
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
    <div className="bg-gradient-to-br from-violet-50/90 via-indigo-50/90 to-blue-50/90 rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-violet-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
          Autokey Cipher Visualization
        </h2>
        <button
          onClick={handleClose}
          className="p-2 text-violet-600 hover:text-violet-800 transition-colors"
          aria-label="Close visualization"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white/80 p-6 rounded-xl border border-violet-200">
          <h3 className="text-lg font-semibold mb-4 text-violet-700">Input</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-violet-600 mb-2">Plaintext:</p>
              <p className="font-mono bg-white/90 p-2 rounded border border-violet-200 break-all whitespace-pre-wrap min-h-[40px]">
                {plaintext}
              </p>
            </div>
            <div>
              <p className="text-sm text-violet-600 mb-2">Initial Key:</p>
              <p className="font-mono bg-white/90 p-2 rounded border border-violet-200">{initialKey}(mod26) ≡ {initialKey % 26} → {firstKeyChar}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handleStepBackward}
            disabled={currentStep === 0}
            className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
              currentStep === 0 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
            }`}
          >
            <BackwardIcon />
          </button>

          <button
            onClick={handlePlayPause}
            className="px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg 
              hover:from-violet-600 hover:to-indigo-600 transition-all flex items-center space-x-2"
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
            className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
              currentStep === steps.length - 1 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
            }`}
          >
            <ForwardIcon />
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg 
              hover:from-violet-600 hover:to-indigo-600 transition-all flex items-center space-x-2"
          >
            <ResetIcon /> <span>Reset</span>
          </button>
        </div>

        <div className="bg-white/80 p-6 rounded-xl border border-violet-200">
          <h3 className="text-lg font-semibold mb-4 text-violet-700">Visualization</h3>
          <div className="flex flex-col items-center space-y-6 mb-6">
            <div className="w-full">
              <p className="text-sm text-violet-600 mb-2 text-center">Original Text</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${
                      index === currentStep 
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white border-violet-400' 
                        : 'bg-white border-violet-200'
                    }`}
                  >
                    {step.original === ' ' ? '\u00A0' : step.original}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm text-violet-600 mb-2 text-center">Key Stream</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${
                      index === currentStep 
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white border-violet-400' 
                        : 'bg-white border-violet-200'
                    }`}
                  >
                    {index <= currentStep ? step.keyChar : '?'}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm text-violet-600 mb-2 text-center">Encrypted Text</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${
                      index === currentStep 
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white border-violet-400' 
                        : 'bg-white border-violet-200'
                    }`}
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
              className="bg-white/90 p-4 rounded-lg font-mono text-sm text-center 
                whitespace-pre-wrap break-all border border-violet-200"
            >
              {steps[currentStep]?.calculation}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AutokeyCipherVisualization;