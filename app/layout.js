import '../styles/globals.css';
import React from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}