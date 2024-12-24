"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { CloseIcon, PlayIcon, PauseIcon, ResetIcon, BackwardIcon, ForwardIcon } from '../icons/VisualizationIcons';

// Helper functions
const splitEvenOdd = (text) => {
  // Remove spaces from the text
  const cleanText = text.replace(/\s+/g, '');
  let even = '';
  let odd = '';
  for (let i = 0; i < cleanText.length; i++) {
    if (i % 2 === 0) {
      even += cleanText[i];
    } else {
      odd += cleanText[i];
    }
  }
  return { even, odd, cleanText };
};

// Child Components
const VisualizationHeader = ({ onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
      Rail Fence Cipher Visualization
    </h2>
    <button
      onClick={onClose}
      className="p-2 text-violet-600 hover:text-violet-800 transition-colors"
      aria-label="Close visualization"
    >
      <CloseIcon />
    </button>
  </div>
);

const Controls = ({
  isPlaying,
  onPlayPause,
  onStepBackward,
  onStepForward,
  onReset,
  canStepBackward,
  canStepForward,
}) => (
  <div className="flex justify-center items-center space-x-4 mb-8">
    <button
      onClick={onStepBackward}
      disabled={!canStepBackward}
      className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
        !canStepBackward 
          ? 'bg-gray-200 text-gray-400' 
          : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
      }`}
    >
      <BackwardIcon />
    </button>
    <button
      onClick={onPlayPause}
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
      onClick={onStepForward}
      disabled={!canStepForward}
      className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
        !canStepForward 
          ? 'bg-gray-200 text-gray-400' 
          : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
      }`}
    >
      <ForwardIcon />
    </button>
    <button
      onClick={onReset}
      className="px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg 
        hover:from-violet-600 hover:to-indigo-600 transition-all flex items-center space-x-2"
    >
      <ResetIcon /> <span>Reset</span>
    </button>
  </div>
);

const InputSection = ({ text }) => (
  <div className="bg-white/80 p-6 rounded-xl border border-violet-200">
    <h3 className="text-lg font-semibold mb-4 text-violet-700">Input</h3>
    <div>
      <p className="text-sm text-violet-600 mb-2">Plaintext:</p>
      <p className="font-mono bg-white/90 p-2 rounded border border-violet-200 break-all whitespace-pre-wrap min-h-[40px]">
        {text}
      </p>
    </div>
  </div>
);

const InputTextDisplay = ({ text }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-violet-700 mb-4">Step 1: Original Text</h3>
    <div className="flex flex-wrap gap-2 p-4 bg-violet-50 rounded-lg">
      {text.split('').map((char, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="w-8 h-8 flex items-center justify-center bg-white rounded shadow"
        >
          {char}
        </motion.div>
      ))}
    </div>
  </div>
);

const SeparationDisplay = ({ text, evenChars, oddChars }) => {
  const [showWrapped, setShowWrapped] = useState(false);

  // Calculate how many characters can fit in first two lines (should be even)
  const charsPerLine = 8; // This can be adjusted based on screen size
  const firstTwoLinesCount = Math.floor(charsPerLine / 2) * 4; // Ensure even number for both lines

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWrapped(true);
    }, 1500); // Show wrapped content after initial separation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-violet-700 mb-4">Step 2: Separating Even and Odd Positions</h3>
      <div className="space-y-24">
        <div>
          <p className="text-sm text-violet-600 mb-16">Original positions:</p>
          <div className="flex flex-wrap gap-y-16 gap-x-2 relative">
            {text.split('').map((char, idx) => {
              const row = Math.floor(idx / Math.floor((window.innerWidth - 64) / 40));
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 0 }}
                  animate={{
                    y: row % 2 === 0 ? (idx % 2 === 0 ? -20 : 20) : (idx % 2 === 0 ? 20 : -20),
                    backgroundColor: idx % 2 === 0 ? '#bfdbfe' : '#ddd6fe'
                  }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow"
                >
                  {char}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          {/* First two lines */}
          <div className="grid grid-cols-2 gap-8">
            {/* Even positions - First line */}
            <div className="space-y-8">
              <p className="text-sm text-violet-600">Even positions:</p>
              <div className="flex flex-wrap gap-2">
                {text.split('').map((char, idx) => {
                  if (idx % 2 !== 0) return null;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="w-8 h-8 flex items-center justify-center bg-violet-100 rounded shadow"
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Odd positions - Second line */}
            <div className="space-y-8">
              <p className="text-sm text-violet-600">Odd positions:</p>
              <div className="flex flex-wrap gap-2">
                {text.split('').map((char, idx) => {
                  if (idx % 2 !== 1) return null;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded shadow"
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultDisplay = ({ evenChars, oddChars }) => {
  const [animationState, setAnimationState] = useState('separate'); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('combined');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const combinedString = evenChars + oddChars;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-violet-700 mb-4">Step 3: Combining Odd and Even Positions</h3>
      <div className="relative min-h-[160px] bg-violet-50 rounded-lg p-4 overflow-hidden">
        <div className="absolute w-full">
          {animationState === 'separate' ? (
            <div className="flex flex-col gap-6">
              {/* First string (even positions) */}
              <div className="flex flex-wrap gap-2">
                {evenChars.split('').map((char, idx) => (
                  <motion.div
                    key={`even-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-8 h-8 flex items-center justify-center bg-violet-100 rounded shadow"
                  >
                    {char}
                  </motion.div>
                ))}
              </div>

              {/* Second string (odd positions) */}
              <div className="flex flex-wrap gap-2">
                {oddChars.split('').map((char, idx) => (
                  <motion.div
                    key={`odd-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded shadow"
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {combinedString.split('').map((char, idx) => (
                <motion.div
                  key={`combined-${idx}`}
                  initial={{ 
                    y: idx >= evenChars.length ? 48 : 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: 0,
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: idx * 0.05 
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded shadow ${
                    idx < evenChars.length ? 'bg-violet-100' : 'bg-indigo-100'
                  }`}
                >
                  {char}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-violet-600">
        <p className="text-center">
          {animationState === 'separate' ? 'Showing odd and even position strings separately...' : 'Combined into final ciphertext'}
        </p>
      </div>
    </div>
  );
};

const RailFenceCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const text = searchParams.get('text') || '';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { even: evenChars, odd: oddChars, cleanText } = splitEvenOdd(text);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 2) {
            setIsPlaying(false);
            return 2;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleClose = () => {
    router.push('/encryption');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-gradient-to-br from-violet-50/90 via-indigo-50/90 to-blue-50/90 rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-violet-200">
      <VisualizationHeader onClose={handleClose} />
      
      <InputSection text={text} />

      <div className="border-t border-gray-200 my-8 pt-8">
        <Controls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStepBackward={handleStepBackward}
          onStepForward={handleStepForward}
          onReset={handleReset}
          canStepBackward={currentStep > 0}
          canStepForward={currentStep < 2}
        />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <InputTextDisplay text={cleanText} />
              </motion.div>
            )}
            
            {currentStep === 1 && (
              <motion.div
                key="separation"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <SeparationDisplay text={cleanText} evenChars={evenChars} oddChars={oddChars} />
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ResultDisplay evenChars={evenChars} oddChars={oddChars} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RailFenceCipherVisualization;
