"use client";
import React, { Suspense } from 'react';
import MultiplicativeCipherVisualization from '../../../components/visualizations/MultiplicativeCipherVisualization';

export default function MultiplicativeVisualizePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen p-4 sm:p-6 md:p-8 relative z-10">
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-morphism p-6 sm:p-8 rounded-2xl">
          <MultiplicativeCipherVisualization />
        </div>
      </div>
    </div>
    </Suspense>
  );
} 