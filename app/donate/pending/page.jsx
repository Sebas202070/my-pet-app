// src/app/donate/pending/page.jsx
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Donación Pendiente - Mascotas Solidarias Misiones',
  description: 'Tu donación está pendiente de confirmación.',
};

export default function DonatePendingPage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <ClockIcon className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-4">
          ¡Donación Pendiente!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu donación está pendiente de confirmación. Una vez que el pago sea procesado, recibirás una notificación.
        </p>
        <p className="text-md text-gray-600 mb-8">
          Gracias por tu paciencia y por tu apoyo a las mascotas de Misiones.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}