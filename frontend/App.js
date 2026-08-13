import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRouter from './src/App';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppRouter />
    </SafeAreaProvider>
  );
}
