// src/components/SessionProviderWrapper.jsx
'use client'; // ¡Este componente debe ser un Client Component!

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}