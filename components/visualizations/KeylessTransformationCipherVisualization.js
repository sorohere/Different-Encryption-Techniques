'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { CloseIcon, PlayIcon, PauseIcon, ResetIcon, BackwardIcon, ForwardIcon } from '../icons/VisualizationIcons';
import { encrypt } from '../../utils/keylessTransformationCipher';

// Child Components
const VisualizationHeader = ({ onClose }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 text-transparent bg-clip-text">
      Keyless Transformation Cipher Visualization
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
      className={`p-2 rounded-lg transition-all ${
        !canStepBackward 
          ? 'bg-gray-200 text-gray-400' 
          : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
      }`}
      aria-label="Step backward"
    >
      <BackwardIcon />
    </button>
    <button
      onClick={onPlayPause}
      className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg 
        hover:from-violet-600 hover:to-indigo-600 transition-all"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
    <button
      onClick={onStepForward}
      disabled={!canStepForward}
      className={`p-2 rounded-lg transition-all ${
        !canStepForward 
          ? 'bg-gray-200 text-gray-400' 
          : 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600'
      }`}
      aria-label="Step forward"
    >
      <ForwardIcon />
    </button>
    <button
      onClick={onReset}
      className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg 
        hover:from-violet-600 hover:to-indigo-600 transition-all"
      aria-label="Reset"
    >
      <ResetIcon />
    </button>
  </div>
);

const GridDisplay = ({ grid, step, highlightCol }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 text-violet-700">
      {step === 0 ? "Creating Grid" : "Reading Column by Column"}
    </h3>
    {grid.length > 0 && grid[0] && (
      <div className="flex justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
          {grid.map((row, rowIndex) =>
            row.map((char, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  backgroundColor: highlightCol === colIndex ? '#DDD6FE' : '#FFFFFF'
                }}
                className={`w-8 h-8 flex items-center justify-center border rounded
                  ${highlightCol === colIndex ? 'bg-violet-200' : 'bg-white'} 
                  border-violet-200`}
              >
                {char}
              </motion.div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
);

const ResultDisplay = ({ result }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 text-violet-700">Result</h3>
    <div className="flex flex-wrap justify-center gap-2">
      {result.split('').map((char, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="w-8 h-8 flex items-center justify-center border rounded 
            bg-gradient-to-br from-violet-100 to-blue-100 border-violet-200"
        >
          {char}
        </motion.div>
      ))}
    </div>
  </div>
);

const InputDisplay = ({ text, columns }) => (
  <div className="mb-8 space-y-4">
    <div>
      <label className="block text-sm font-medium text-violet-700 mb-1">
        Plaintext Input
      </label>
      <div className="w-full p-2 border border-violet-200 rounded-md bg-white/80">
        {text}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-violet-700 mb-1">
        Number of Columns
      </label>
      <div className="w-full p-2 border border-violet-200 rounded-md bg-white/80">
        {columns}
      </div>
    </div>
  </div>
);

const KeylessTransformationCipherVisualization = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialText = searchParams.get('text') || '';
  const initialColumns = searchParams.get('columns') ? parseInt(searchParams.get('columns')) : 3;

  const [text] = useState(initialText);
  const [columns] = useState(initialColumns);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState([]);
  const [result, setResult] = useState('');
  const [highlightCol, setHighlightCol] = useState(-1);
  const [columnResults, setColumnResults] = useState([]);

  const generateVisualizationSteps = () => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const numRows = Math.ceil(cleanText.length / columns);
    const newGrid = Array(numRows).fill().map(() => Array(columns).fill(''));
    
    let charIndex = 0;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < columns; col++) {
        if (charIndex < cleanText.length) {
          newGrid[row][col] = cleanText[charIndex];
          charIndex++;
        }
      }
    }
    
    setGrid(newGrid);
    setResult('');
    setHighlightCol(-1);
    setColumnResults([]);
  };

  useEffect(() => {
    generateVisualizationSteps();
  }, [text, columns]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= columns) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, columns]);

  useEffect(() => {
    if (currentStep > 0 && currentStep <= columns) {
      const col = currentStep - 1;
      setHighlightCol(col);
      let colResult = '';
      for (let row = 0; row < grid.length; row++) {
        if (grid[row][col]) {
          colResult += grid[row][col];
        }
      }
      const newColumnResults = [...columnResults];
      newColumnResults[col] = colResult;
      setColumnResults(newColumnResults);
      setResult(newColumnResults.join(''));
    } else {
      setHighlightCol(-1);
    }
  }, [currentStep]);

  const handleClose = () => {
    router.back();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep <= columns) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const newColumnResults = [...columnResults];
      newColumnResults[currentStep - 1] = '';
      setColumnResults(newColumnResults);
      setResult(newColumnResults.join(''));
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResult('');
    setHighlightCol(-1);
    setIsPlaying(false);
    setColumnResults([]);
  };

  return (
    <div className="bg-gradient-to-br from-violet-50/90 via-indigo-50/90 to-blue-50/90 
      rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-violet-200">
      <VisualizationHeader onClose={handleClose} />
      <InputDisplay text={text} columns={columns} />
      <Controls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStepBackward={handleStepBackward}
        onStepForward={handleStepForward}
        onReset={handleReset}
        canStepBackward={currentStep > 0}
        canStepForward={currentStep <= columns}
      />
      <GridDisplay
        grid={grid}
        step={currentStep}
        highlightCol={highlightCol}
      />
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default KeylessTransformationCipherVisualization;
