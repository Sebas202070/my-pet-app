// src/app/donate/success/page.jsx
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Donación Exitosa - Mascotas Solidarias Misiones',
  description: '¡Gracias por tu donación! Tu aporte ayuda a las mascotas en Misiones.',
};

export default function DonateSuccessPage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          ¡Donación Exitosa!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu generoso aporte ha sido recibido con éxito. ¡Muchas gracias por ayudar a las mascotas de Misiones!
        </p>
        <p className="text-md text-gray-600 mb-8">
          Con tu contribución, podemos seguir rescatando, alimentando y encontrando hogares amorosos.
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