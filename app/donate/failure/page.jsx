// src/app/donate/failure/page.jsx
import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Donación Fallida - Mascotas Solidarias Misiones',
  description: 'Lo sentimos, tu donación no pudo ser procesada.',
};

export default function DonateFailurePage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <XCircleIcon className="h-24 w-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">
          ¡Donación Fallida!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Lo sentimos, no pudimos procesar tu donación en este momento. Por favor, intenta nuevamente.
        </p>
        <p className="text-md text-gray-600 mb-8">
          Si el problema persiste, puedes intentar con otro método de pago o <Link href="/contact" className="text-blue-600 hover:underline">contactarnos</Link> para recibir ayuda.
        </p>
        <Link
          href="/donate"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Reintentar Donación
        </Link>
      </div>
    </div>
  );
}