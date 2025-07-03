// src/app/dashboard/page.jsx
'use client'; // ¡Este es un Client Component!

import { useSession } from 'next-auth/react'; // Para acceder a la sesión
import { useRouter } from 'next/navigation'; // Para redirigir
import { useEffect } from 'react'; // Para efectos secundarios
import { UserCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Iconos

export default function DashboardPage() {
  const { data: session, status } = useSession(); // Obtiene la sesión y su estado
  const router = useRouter();

  useEffect(() => {
    // Si la sesión ha terminado de cargar y el usuario NO está autenticado, redirige al login
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dashboard'); // Redirige al login, con un callback para volver aquí
    }
  }, [status, router]); // Dependencias del useEffect

  // Muestra un mensaje de carga mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, muestra el contenido del dashboard
  if (session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-6 flex items-center justify-center">
            <ChartBarIcon className="h-10 w-10 mr-3" />
            Bienvenido a tu Dashboard
          </h1>
          <div className="text-lg text-gray-800 mb-4">
            <p className="mb-2">
              <UserCircleIcon className="inline-block h-6 w-6 mr-2 text-blue-500" />
              Hola, <span className="font-semibold text-blue-600">{session.user.name || session.user.email}</span>!
            </p>
            <p className="text-gray-600">
              Aquí podrás gestionar tus reportes, ver tus mascotas favoritas y acceder a configuraciones de tu cuenta.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ejemplo de tarjeta de funcionalidad */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">Mis Reportes</h2>
              <p className="text-gray-700 mb-4">Visualiza y gestiona todos los reportes de mascotas que has realizado.</p>
              <Link href="/my-reports" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Ver Mis Reportes
              </Link>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-green-700 mb-3">Mascotas Favoritas</h2>
              <p className="text-gray-700 mb-4">Explora las mascotas que has marcado como favoritas y sigue su estado.</p>
              <Link href="/favorites" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                Ver Favoritas
              </Link>
            </div>
          </div>

          {/* Puedes añadir más secciones o enlaces aquí */}
        </div>
      </div>
    );
  }

  // Si el usuario no está autenticado, no renderiza nada aquí, el useEffect ya lo redirigió
  return null;
}