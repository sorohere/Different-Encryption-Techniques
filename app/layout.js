import '../styles/globals.css';
import React from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="animated-background">
          <div className="light-wave"></div>
          <div className="light-wave"></div>
          <div className="light-wave"></div>
        </div>
        {children}
      </body>
    </html>
  );
}