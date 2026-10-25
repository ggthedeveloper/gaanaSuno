import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LibraryProvider } from './context/LibraryContext';
import { AudioProvider } from './context/AudioContext';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LibraryProvider>
        <AudioProvider>
          <AppShell />
        </AudioProvider>
      </LibraryProvider>
    </ThemeProvider>
  );
};

export default App;
