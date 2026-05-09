import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './context/SocketContext';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false }
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Dashboard />
      </SocketProvider>
    </QueryClientProvider>
  );
}