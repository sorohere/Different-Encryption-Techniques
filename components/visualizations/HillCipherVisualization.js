"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { CloseIcon, PlayIcon, PauseIcon, ResetIcon, BackwardIcon, ForwardIcon } from '../icons/VisualizationIcons';

// Helper functions
const mod = (x, m) => ((x % m) + m) % m;

const prepareMessage = (message, size) => {
  let prepared = message.toUpperCase().replace(/[^A-Z]/g, "");
  while (prepared.length % size !== 0) {
    prepared += 'X';
  }
  return prepared;
};

const letterToNumber = (letter) => letter.charCodeAt(0) - 65;
const numberToLetter = (number) => String.fromCharCode((mod(number, 26)) + 65);

const multiplyMatrices = (keyMatrix, block) => {
  const result = [];
  const size = keyMatrix.length;
  
  for (let i = 0; i < size; i++) {
    let sum = 0;
    for (let j = 0; j < size; j++) {
      sum += keyMatrix[i][j] * block[j];
    }
    result.push(mod(sum, 26));
  }
  return result;
};

// Child Components
const VisualizationHeader = ({ onClose }) => (
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold text-blue-800">Hill Cipher Visualization</h2>
    <button
      onClick={onClose}
      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
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
      className={`p-2 rounded-lg transition-colors ${
        !canStepBackward ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      <BackwardIcon />
    </button>
    <button
      onClick={onPlayPause}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
    <button
      onClick={onStepForward}
      disabled={!canStepForward}
      className={`p-2 rounded-lg transition-colors ${
        !canStepForward ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      <ForwardIcon />
    </button>
    <button
      onClick={onReset}
      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
    >
      <ResetIcon />
    </button>
  </div>
);

const MatrixDisplay = ({ matrix, label, highlight }) => (
  <div className="flex flex-col items-center m-2">
    <span className="text-sm text-gray-600 mb-2">{label}</span>
    <div className="border-2 border-blue-500 p-2 rounded-lg">
      {matrix.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => (
            <motion.div
              key={j}
              className={`w-10 h-10 flex items-center justify-center m-1 rounded-md
                ${highlight?.[i]?.[j] ? 'bg-yellow-200' : 'bg-gray-100'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {cell}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const BlockDisplay = ({ block, label, isAnimated = false }) => (
  <motion.div
    className="flex flex-col items-center m-2"
    initial={isAnimated ? { opacity: 0, y: 20 } : false}
    animate={isAnimated ? { opacity: 1, y: 0 } : false}
  >
    <span className="text-sm text-gray-600 mb-2">{label}</span>
    <div className="flex space-x-2">
      {block.map((char, i) => (
        <div
          key={i}
          className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-md"
        >
          {char}
        </div>
      ))}
    </div>
  </motion.div>
);

const ResultDisplay = ({ encryptedBlocks, currentBlockIndex }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-blue-700 mb-4">Final Result</h3>
    <div className="flex flex-wrap justify-center gap-4">
      {encryptedBlocks.map((block, blockIndex) => (
        <div key={blockIndex} className="flex space-x-2">
          {block.map((char, charIndex) => (
            <div
              key={charIndex}
              className={`w-10 h-10 flex items-center justify-center rounded-md
                ${blockIndex <= currentBlockIndex ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              {blockIndex <= currentBlockIndex ? char : '?'}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const HillCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const plaintext = searchParams.get('text') || '';
  const keyStr = searchParams.get('key') || '';

  // Parse key matrix from string
  const keyMatrix = JSON.parse(keyStr || '[]');
  const size = keyMatrix.length;

  // Prepare text and create blocks
  const preparedText = prepareMessage(plaintext, size);
  const textBlocks = [];
  for (let i = 0; i < preparedText.length; i += size) {
    textBlocks.push(preparedText.slice(i, i + size));
  }

  // Convert blocks to numbers
  const numericalBlocks = textBlocks.map(block =>
    Array.from(block).map(letterToNumber)
  );

  // Calculate encrypted blocks
  const encryptedBlocks = numericalBlocks.map(block =>
    multiplyMatrices(keyMatrix, block)
  );

  // Convert back to letters
  const encryptedText = encryptedBlocks
    .map(block => block.map(numberToLetter))
    .join('');

  const totalSteps = textBlocks.length * 4;

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < totalSteps) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= totalSteps) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, speed]);

  const handleClose = () => router.back();
  const currentBlockIndex = Math.floor(currentStep / 4);
  const currentBlockStep = currentStep % 4;

  const canStepBackward = currentStep > 0;
  const canStepForward = currentStep < totalSteps;

  const handleStepForward = () => {
    if (canStepForward) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (canStepBackward) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <VisualizationHeader onClose={handleClose} />
          
          <Controls
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStepBackward={handleStepBackward}
            onStepForward={handleStepForward}
            onReset={handleReset}
            canStepBackward={canStepBackward}
            canStepForward={canStepForward}
          />
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Input</h3>
            <div className="flex justify-center items-center space-x-8">
              <BlockDisplay
                block={Array.from(preparedText)}
                label="Prepared Text"
              />
              <MatrixDisplay
                matrix={keyMatrix}
                label="Key Matrix"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentBlockStep === 0 && (
              <motion.div
                key="division"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Block {currentBlockIndex + 1}: Text Division
                </h3>
                <BlockDisplay
                  block={Array.from(textBlocks[currentBlockIndex])}
                  label="Current Block"
                  isAnimated
                />
              </motion.div>
            )}

            {currentBlockStep === 1 && (
              <motion.div
                key="numerical"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Numerical Conversion
                </h3>
                <BlockDisplay
                  block={Array.from(textBlocks[currentBlockIndex]).map(
                    (char, i) => `${char}=${letterToNumber(char)}`
                  )}
                  label="Letter to Number"
                  isAnimated
                />
              </motion.div>
            )}

            {currentBlockStep === 2 && (
              <motion.div
                key="multiplication"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Matrix Multiplication
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <MatrixDisplay
                    matrix={keyMatrix}
                    label="Key Matrix"
                  />
                  <span className="text-2xl">×</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-2">Number Vector</span>
                    <div className="border-2 border-blue-500 p-2 rounded-lg">
                      {numericalBlocks[currentBlockIndex].map((num, i) => (
                        <div key={i} className="w-10 h-10 flex items-center justify-center">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-2xl">=</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600 mb-2">Result (mod 26)</span>
                    <div className="border-2 border-blue-500 p-2 rounded-lg">
                      {encryptedBlocks[currentBlockIndex].map((num, i) => (
                        <div key={i} className="w-10 h-10 flex items-center justify-center">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentBlockStep === 3 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Block Result
                </h3>
                <BlockDisplay
                  block={encryptedBlocks[currentBlockIndex].map(numberToLetter)}
                  label="Encrypted Block"
                  isAnimated
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ResultDisplay
            encryptedBlocks={encryptedBlocks.map(block => block.map(numberToLetter))}
            currentBlockIndex={currentBlockIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default HillCipherVisualization;