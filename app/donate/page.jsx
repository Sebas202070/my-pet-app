// src/app/donate/page.jsx
import Link from 'next/link';
import DonationWidget from '/components/DonationWidget'; // Importa el componente de donación

export const metadata = {
  title: 'Donar - Mascotas Solidarias Misiones',
  description: 'Ayuda a Mascotas Solidarias Misiones con tu donación. Cada aporte cuenta para rescatar, alimentar y encontrar hogar a mascotas en necesidad.',
};

export default function DonatePage() {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Tu Ayuda Transforma Vidas
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
          En Mascotas Solidarias Misiones, cada donación es un paso más hacia el rescate, la recuperación y la búsqueda de un hogar amoroso para nuestros amigos peludos. Tu generosidad nos permite cubrir gastos de alimentación, atención veterinaria, medicinas y campañas de concientización.
        </p>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            ¿Cómo puedes ayudar?
          </h2>
          <DonationWidget /> {/* Aquí se renderizará el widget de donación */}
        </div>

        <div className="mt-10 text-center text-gray-600 text-sm">
          <p>
            ¡Gracias por ser parte de esta comunidad solidaria!
          </p>
          <p className="mt-2">
            Si tienes dudas o quieres colaborar de otra manera, <Link href="/contact" className="text-blue-600 hover:underline">contáctanos</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}