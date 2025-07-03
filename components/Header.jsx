
'use client'; // ¡Este componente ahora es un Client Component!

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // Importa useSession y signOut
import { HomeIcon, PlusCircleIcon, HeartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'; // Iconos

export default function Header() {
  const { data: session, status } = useSession(); // Hook para acceder a la sesión

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo o Nombre de la App */}
        <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition-colors flex items-center">
          <HeartIcon className="h-7 w-7 mr-2" />
          Mascotas Solidarias
        </Link>

        {/* Navegación Principal */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center hover:text-blue-200 transition-colors">
            <HomeIcon className="h-5 w-5 mr-1" />
            Inicio
          </Link>
          <Link href="/reports/new" className="flex items-center hover:text-blue-200 transition-colors">
            <PlusCircleIcon className="h-5 w-5 mr-1" />
            Reportar
          </Link>
          <Link href="/donate" className="flex items-center hover:text-blue-200 transition-colors">
            <CurrencyDollarIcon className="h-5 w-5 mr-1" />
            Donar
          </Link>

          {/* Renderizado Condicional basado en el estado de la sesión */}
          {status === 'loading' ? (
            // Opcional: Mostrar un spinner o mensaje de carga mientras se carga la sesión
            <span className="text-blue-200">Cargando...</span>
          ) : session ? (
            // Si hay sesión (usuario logueado)
            <>
              <Link href="/dashboard" className="flex items-center hover:text-blue-200 transition-colors">
                <UserCircleIcon className="h-5 w-5 mr-1" />
                Hola, {session.user.name || session.user.email}!
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })} // Cierra sesión y redirige a la raíz
                className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Si no hay sesión (usuario no logueado)
            <Link href="/login" className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors">
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}