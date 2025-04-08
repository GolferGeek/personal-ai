'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // This ensures a new QueryClient is created for each browser session
  // instead of being shared between different users/requests
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 