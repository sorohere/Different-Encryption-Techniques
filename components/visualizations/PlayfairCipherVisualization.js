"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlayIcon, PauseIcon, ResetIcon, CloseIcon, ForwardIcon, BackwardIcon } from '../icons/VisualizationIcons';

const PlayfairCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const plaintext = searchParams.get('text') || '';
  const key = searchParams.get('key') || '';

  // Generate 5x5 matrix from key
  const generateMatrix = (key) => {
    const processedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: I/J share a cell
    const matrix = [];
    const used = new Set();

    // Add key characters first
    for (let char of processedKey) {
      if (char === 'J') char = 'I';
      if (!used.has(char)) {
        used.add(char);
        matrix.push(char);
      }
    }

    // Add remaining alphabet
    for (let char of alphabet) {
      if (!used.has(char)) {
        used.add(char);
        matrix.push(char);
      }
    }

    // Convert to 5x5 grid
    return Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, (i + 5) * 5));
  };

  const matrix = generateMatrix(key);

  // Find position of a character in matrix
  const findPosition = (char) => {
    if (char === 'J') char = 'I';
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  // Process text into digraphs
  const processText = (text) => {
    text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const digraphs = [];
    let i = 0;
    while (i < text.length) {
      if (i === text.length - 1 || text[i] === text[i + 1]) {
        digraphs.push([text[i], 'X']);
        i++;
      } else {
        digraphs.push([text[i], text[i + 1]]);
        i += 2;
      }
    }
    return digraphs;
  };

  const digraphs = processText(plaintext);

  const steps = digraphs.map(([char1, char2]) => {
    const pos1 = findPosition(char1);
    const pos2 = findPosition(char2);
    let encryptedPair = '';
    let rule = '';

    if (pos1.row === pos2.row) {
      encryptedPair = matrix[pos1.row][(pos1.col + 1) % 5] + matrix[pos2.row][(pos2.col + 1) % 5];
      rule = 'Same row: Take the letter to the right of each one (going back to the leftmost if at the rightmost position).';
    } else if (pos1.col === pos2.col) {
      encryptedPair = matrix[(pos1.row + 1) % 5][pos1.col] + matrix[(pos2.row + 1) % 5][pos2.col];
      rule = 'Same column: Take the letter below each one (going back to the top if at the bottom).';
    } else {
      encryptedPair = matrix[pos1.row][pos2.col] + matrix[pos2.row][pos1.col];
      rule = 'Rectangle: Form a rectangle with the two letters and take the letters on the horizontal opposite corner of the rectangle.';
    }

    return {
      original: char1 + char2,
      encrypted: encryptedPair,
      positions: { first: pos1, second: pos2 },
      rule: rule
    };
  });

  // ... Standard animation controls (same as other visualizations)
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

  // Helper function to get the encrypted position for a letter
  const getEncryptedPosition = (pos1, pos2, index) => {
    if (pos1.row === pos2.row) {
      // Same row - shift right
      if (index === 0) {
        return { row: pos1.row, col: (pos1.col + 1) % 5 };
      } else {
        return { row: pos2.row, col: (pos2.col + 1) % 5 };
      }
    } else if (pos1.col === pos2.col) {
      // Same column - shift down
      if (index === 0) {
        return { row: (pos1.row + 1) % 5, col: pos1.col };
      } else {
        return { row: (pos2.row + 1) % 5, col: pos2.col };
      }
    } else {
      // Rectangle - swap columns
      if (index === 0) {
        return { row: pos1.row, col: pos2.col };
      } else {
        return { row: pos2.row, col: pos1.col };
      }
    }
  };

  // Helper function to get the arrow path for a letter
  const getArrowPath = (pos, encryptedPos, isSecondLetter) => {
    const cellSize = 58;
    const center = 29;
    const penetration = 2;    // Keep minimal penetration

    const x1 = pos.col * cellSize;
    const y1 = pos.row * cellSize;
    const x2 = encryptedPos.col * cellSize;
    const y2 = encryptedPos.row * cellSize;

    if (pos.row === encryptedPos.row) {
      // Same row - arrows far from center (top/bottom)
      const yPos = isSecondLetter ? 
        y1 + cellSize - 10 :  // Green arrow stays at bottom
        y1 + 20;              // Pink arrow moved closer to center
      return `M ${x1 + center} ${yPos} 
              L ${x2 + center} ${yPos}`;
    } 
    else if (pos.col === encryptedPos.col) {
      // Same column - arrows far from center (left/right)
      const xPos = isSecondLetter ? 
        x1 + cellSize - 10 :  // Green arrow stays at right
        x1 + 20;              // Pink arrow moved closer to center
      return `M ${xPos} ${y1 + center} 
              L ${xPos} ${y2 + center}`;
    } 
    else {
      // Rectangle - corners far from center
      if (isSecondLetter) {
        // Green arrow stays the same
        return `M ${x1 + cellSize - 10} ${y1 + cellSize - 10} 
                L ${x2 + cellSize - penetration} ${y2 + cellSize - 10}`;
      } else {
        // Pink arrow moved closer to center
        return `M ${x1 + 20} ${y1 + 20} 
                L ${x2 + penetration} ${y2 + 20}`;
      }
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
        Playfair Cipher Visualization
      </h2>

      {/* Standard control buttons */}
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
        {/* Input section */}
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

        {/* Matrix Display */}
        <div className="bg-white/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Key Matrix (I/J share same cell)</h3>
          <div className="flex justify-center mb-6">
            <div className="relative grid grid-cols-5 gap-1 bg-blue-100 p-1 rounded-lg">
              {[0, 1, 2, 3, 4].map(i => (
                <React.Fragment key={i}>
                  {[0, 1, 2, 3, 4].map(j => (
                    <motion.div
                      key={`${i}-${j}`}
                      className={`w-14 h-14 flex items-center justify-center rounded-lg text-lg font-semibold
                        ${currentStep < steps.length && 
                          (i === steps[currentStep].positions.first.row && j === steps[currentStep].positions.first.col ||
                           i === steps[currentStep].positions.second.row && j === steps[currentStep].positions.second.col)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-blue-800'}`}
                    >
                      {matrix[i][j] === 'I' ? 'I/J' : matrix[i][j]}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}

              {/* Arrows SVG Overlay */}
              {currentStep < steps.length && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ 
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <defs>
                    <marker
                      id="arrowhead-first"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#EC4899"/>
                    </marker>
                    <marker
                      id="arrowhead-second"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#10B981"/>
                    </marker>
                  </defs>

                  {/* First Letter Arrow */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    d={getArrowPath(
                      steps[currentStep].positions.first,
                      getEncryptedPosition(steps[currentStep].positions.first, steps[currentStep].positions.second, 0),
                      false
                    )}
                    stroke="#EC4899"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead-first)"
                  />

                  {/* Second Letter Arrow */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    d={getArrowPath(
                      steps[currentStep].positions.second,
                      getEncryptedPosition(steps[currentStep].positions.first, steps[currentStep].positions.second, 1),
                      true
                    )}
                    stroke="#10B981"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead-second)"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="text-center text-sm text-blue-600">
            <p>Note: I and J share the same cell in the matrix</p>
          </div>
        </div>

        {/* Visualization section */}
        <div className="bg-white/50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Encryption Process</h3>
          <div className="flex flex-col space-y-6">
            {/* Original Pairs */}
            <div>
              <p className="text-sm text-blue-600 mb-2 text-center">Original Pairs</p>
              <div className="min-h-[100px] bg-blue-50/50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                {steps.map((step, index) => (
                    <motion.div
                      key={`original-${index}`}
                      className={`w-8 h-8 flex items-center justify-center rounded 
                        ${index === currentStep ? 'bg-blue-500 text-white' : 'bg-blue-50'}`}
                    >
                      {index <= currentStep ? step.original : step.original} {/* Updated logic */}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Rule */}
            <div>
              <p className="text-sm text-blue-600 mb-2 text-center">Current Rule</p>
              <div className="min-h-[50px] bg-purple-50/50 rounded-lg p-4 flex justify-center">
                <motion.div
                  className="h-8 px-4 flex items-center justify-center rounded 
                    bg-white text-purple-800 font-medium text-sm"
                >
                  {currentStep < steps.length ? steps[currentStep].rule : '...'}
                </motion.div>
              </div>
            </div>

            {/* Encrypted Pairs */}
            <div>
              <p className="text-sm text-blue-600 mb-2 text-center">Encrypted Pairs</p>
              <div className="min-h-[100px] bg-green-50/50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {steps.map((step, index) => (
                    <motion.div
                      key={`encrypted-${index}`}
                      className={`w-8 h-8 flex items-center justify-center rounded 
                        ${index === currentStep ? 'bg-green-500 text-white' : 'bg-white'}`}
                    >
                      {index <= currentStep ? step.encrypted : '??'}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayfairCipherVisualization; 