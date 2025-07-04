import { Suspense } from 'react'; // Import Suspense

export default function LoginLayout({ children }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}> {/* You can customize the fallback UI */}
      {children}
    </Suspense>
  );
}