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
    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
      Hill Cipher Visualization
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
  <div className="flex justify-center items-center space-x-4 mt-6">
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

const MatrixDisplay = ({ matrix, label, highlight }) => {
  if (!Array.isArray(matrix) || !matrix.length || !Array.isArray(matrix[0])) {
    return (
      <div className="flex flex-col items-center m-2">
        <span className="text-sm text-violet-600 mb-2">{label}</span>
        <div className="border-2 border-violet-200 p-4 rounded-lg">
          <span className="text-violet-500">Invalid Matrix</span>
        </div>
    </div>
    );
  }

  return (
    <div className="flex flex-col items-center m-2">
      <span className="text-sm text-violet-600 mb-2">{label}</span>
      <div className="border-2 border-violet-200 p-2 rounded-lg">
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
};

const BlockDisplay = ({ block, label, isAnimated = false, highlightIndex = -1 }) => (
  <motion.div
    className="flex flex-col items-center m-2"
    initial={isAnimated ? { opacity: 0, y: 20 } : false}
    animate={isAnimated ? { opacity: 1, y: 0 } : false}
  >
    <span className="text-sm text-violet-600 mb-2">{label}</span>
    <div className="flex space-x-2">
      {block.map((char, i) => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-md
            ${highlightIndex === i ? 'bg-green-200' : 'bg-blue-100'}`}
        >
          {char}
        </div>
      ))}
    </div>
  </motion.div>
);

const InputDisplay = ({ text, blockSize, currentBlockIndex }) => {
  const blocks = [];
  for (let i = 0; i < text.length; i += blockSize) {
    blocks.push(text.slice(i, i + blockSize));
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {blocks.map((block, index) => (
        <div key={index} className="flex space-x-2">
          {Array.from(block).map((char, charIndex) => (
            <div
              key={charIndex}
              className={`w-10 h-10 flex items-center justify-center rounded-md
                ${index === currentBlockIndex ? 'bg-green-200' : 'bg-blue-100'}`}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ResultDisplay = ({ encryptedBlocks, currentBlockIndex, currentBlockStep }) => {
  // Only show result when we reach the result step (step 3) for that block
  const shouldShowBlock = (blockIndex) => {
    return blockIndex < currentBlockIndex || (blockIndex === currentBlockIndex && currentBlockStep === 3);
  };

  return (
    <div className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200">
      <h3 className="text-xl font-semibold text-violet-700 mb-4">Final Result</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {encryptedBlocks.map((block, blockIndex) => (
          <div key={blockIndex} className="flex space-x-2">
            {block.map((char, charIndex) => (
              <div
                key={charIndex}
                className={`w-10 h-10 flex items-center justify-center rounded-lg
                  ${shouldShowBlock(blockIndex) ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white' : 'bg-white border border-violet-200'}`}
              >
                {shouldShowBlock(blockIndex) ? char : '?'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const HillCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlockStep, setCurrentBlockStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const plaintext = searchParams.get('text') || '';
  const keyStr = searchParams.get('key') || '';

  // Parse key matrix from string and ensure it's a valid matrix
  let keyMatrix = [];
  try {
    keyMatrix = JSON.parse(decodeURIComponent(keyStr) || '[]');
    if (!Array.isArray(keyMatrix) || !keyMatrix.length || !Array.isArray(keyMatrix[0])) {
      throw new Error('Invalid key matrix format');
    }
    // Convert any string numbers to actual numbers
    keyMatrix = keyMatrix.map(row => row.map(cell => parseInt(cell) || 0));
  } catch (error) {
    console.error('Error parsing key matrix:', error);
    keyMatrix = [[0]]; // Default to 1x1 matrix if invalid
  }

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

  const handleStepForward = () => {
    if (currentBlockStep < 3) {
      setCurrentBlockStep(currentBlockStep + 1);
    } else if (currentBlockIndex < textBlocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
      setCurrentBlockStep(0);
    } else {
      // Reset animation or stop playing
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentBlockStep > 0) {
      setCurrentBlockStep(currentBlockStep - 1);
    } else if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
      setCurrentBlockStep(3);
    }
  };

  const handleReset = () => {
    setCurrentBlockIndex(0);
    setCurrentBlockStep(0);
    setIsPlaying(false);
  };

  // Check if we can move forward or backward
  const canStepForward = !(currentBlockIndex === textBlocks.length - 1 && currentBlockStep === 3);
  const canStepBackward = !(currentBlockIndex === 0 && currentBlockStep === 0);

  // Only show visualization steps if we have valid blocks
  const showVisualization = textBlocks.length > 0 && currentBlockIndex < textBlocks.length;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentBlockStep < 3) {
          setCurrentBlockStep(prev => prev + 1);
        } else if (currentBlockIndex < textBlocks.length - 1) {
          setCurrentBlockIndex(prev => prev + 1);
          setCurrentBlockStep(0);
        } else {
          setIsPlaying(false);
        }
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentBlockStep, currentBlockIndex, textBlocks.length]);

  const handleClose = () => router.back();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-violet-50/90 via-indigo-50/90 to-blue-50/90 rounded-xl shadow-lg p-6 border border-violet-200">
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
          <div className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200">
            <h3 className="text-xl font-semibold text-violet-700 mb-4">Input</h3>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex flex-col items-center">
                <span className="text-sm text-violet-600 mb-2">Prepared Text</span>
                <InputDisplay
                  text={preparedText}
                  blockSize={size}
                  currentBlockIndex={currentBlockIndex}
                />
              </div>
              <MatrixDisplay
                matrix={keyMatrix}
                label="Key Matrix"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showVisualization && (
              <>
                {currentBlockStep === 0 && (
                  <motion.div
                    key="division"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200"
                  >
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">
                      Block {currentBlockIndex + 1}: Text Division
                    </h3>
                    <BlockDisplay
                      block={Array.from(textBlocks[currentBlockIndex] || '')}
                      label="Current Block"
                      isAnimated
                      highlightIndex={-1}
                    />
                  </motion.div>
                )}

                {currentBlockStep === 1 && (
                  <motion.div
                    key="numerical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200"
                  >
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">
                      Numerical Conversion
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {Array.from(textBlocks[currentBlockIndex] || '').map((char, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-violet-100 rounded-t-lg border-t-2 border-x-2 border-violet-200">
                            {char}
                          </div>
                          <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-b-lg border-b-2 border-x-2 border-indigo-200">
                            {letterToNumber(char)}
                          </div>
                          <div className="text-sm text-violet-600 mt-1">
                            Position
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentBlockStep === 2 && (
                  <motion.div
                    key="multiplication"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200"
                  >
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">
                      Matrix Multiplication
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <MatrixDisplay
                        matrix={keyMatrix}
                        label="Key Matrix"
                      />
                      <span className="text-2xl text-violet-700">×</span>
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-violet-600 mb-2">Number Vector</span>
                        <div className="border-2 border-violet-300 p-2 rounded-lg bg-white/90">
                          {numericalBlocks[currentBlockIndex].map((num, i) => (
                            <div key={i} className="w-10 h-10 flex items-center justify-center">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-2xl text-violet-700">=</span>
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-violet-600 mb-2">Raw Result</span>
                        <div className="border-2 border-violet-300 p-2 rounded-lg bg-white/90">
                          {encryptedBlocks[currentBlockIndex].map((num, i) => {
                            const rawResult = numericalBlocks[currentBlockIndex].reduce(
                              (sum, val, j) => sum + keyMatrix[i][j] * val,
                              0
                            );
                            return (
                              <div key={i} className="w-10 h-10 flex items-center justify-center">
                                {rawResult}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <span className="text-2xl text-violet-700">=</span>
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-violet-600 mb-2">Result (mod 26)</span>
                        <div className="border-2 border-indigo-300 p-2 rounded-lg bg-white/90">
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
                    className="bg-white/80 p-6 rounded-lg shadow-md border border-violet-200"
                  >
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">
                      Block Result
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                      {encryptedBlocks[currentBlockIndex].map((num, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-16 h-16 flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg border-2 border-violet-200">
                            <div className="text-lg">{numberToLetter(num)}</div>
                            <div className="text-xs text-violet-600">{num}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          <ResultDisplay
            encryptedBlocks={encryptedBlocks.map(block => block.map(numberToLetter))}
            currentBlockIndex={currentBlockIndex}
            currentBlockStep={currentBlockStep}
          />
        </div>
      </div>
    </div>
  );
};

export default HillCipherVisualization;