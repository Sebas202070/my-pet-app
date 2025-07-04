// src/components/Navbar.jsx
'use client'; // Este componente necesita ser un Client Component para manejar el estado del menú

import { useState } from 'react';
import Link from 'next/link';
// No necesitamos 'next/image' si usamos un icono SVG para el logo
import { useSession, signIn, signOut } from 'next-auth/react'; // Para obtener el estado de la sesión y funciones de auth

// Importa los iconos que necesitas
import {
  HomeIcon,
  PlusCircleIcon,
  HeartIcon, // Icono para el logo
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  CurrencyDollarIcon,
  Bars3Icon, // Icono de hamburguesa
  XMarkIcon // Icono de cerrar (para el menú de hamburguesa)
} from '@heroicons/react/24/outline';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el menú móvil está abierto
  const { data: session, status } = useSession(); // Obtener la sesión del usuario

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y Nombre de la App */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 text-white">
          {/* Usamos el HeartIcon como logo, como lo tenías antes */}
          <HeartIcon className="h-10 w-10 text-red-300" /> {/* Ajusta el tamaño y color si es necesario */}
          <span className="text-2xl font-bold tracking-tight hidden sm:block">
            Mascotas Solidarias
          </span>
          {/* Versión corta para móviles */}
          <span className="text-2xl font-bold tracking-tight block sm:hidden">
            M.S.
          </span>
        </Link>

        {/* Botón de Hamburguesa para Móviles */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md p-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <XMarkIcon className="w-8 h-8" /> // Icono de "X" cuando el menú está abierto
            ) : (
              <Bars3Icon className="w-8 h-8" /> // Icono de hamburguesa cuando el menú está cerrado
            )}
          </button>
        </div>

        {/* Enlaces de Navegación (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium group">
            <HomeIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
            Inicio
          </Link>
          <Link href="/reports" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium group">
            <PlusCircleIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
            Reportes
          </Link>
          <Link href="/reports/new" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium group">
            <PlusCircleIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
            Reportar
          </Link>
          <Link href="/donate" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium group">
            <CurrencyDollarIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
            Donar
          </Link>

          {/* Renderizado Condicional basado en el estado de la sesión */}
          {status === 'loading' ? (
            <span className="text-white text-lg">Cargando...</span>
          ) : session ? (
            <>
              <Link href="/dashboard" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium group">
                <UserCircleIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
                Hola, {session.user.name || session.user.email.split('@')[0]}!
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center bg-white text-blue-700 hover:bg-blue-100 py-2 px-5 rounded-full font-semibold transition-all duration-200 shadow-md text-lg transform hover:-translate-y-0.5"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            // CAMBIO CLAVE AQUÍ: Usamos Link para ir a la página de login
            <Link 
              href="/login" 
              className="flex items-center bg-white text-blue-700 hover:bg-blue-100 py-2 px-5 rounded-full font-semibold transition-all duration-200 shadow-md text-lg transform hover:-translate-y-0.5"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* Menú Móvil (Desplegable) */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-blue-700 rounded-lg shadow-xl animate-fade-in-down">
          <div className="flex flex-col space-y-3 p-4">
            <Link href="/" className="flex items-center text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
              <HomeIcon className="h-5 w-5 mr-2" /> Inicio
            </Link>
            <Link href="/reports" className="flex items-center text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
              <PlusCircleIcon className="h-5 w-5 mr-2" /> Reportes
            </Link>
            <Link href="/reports/new" className="flex items-center text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
              <PlusCircleIcon className="h-5 w-5 mr-2" /> Reportar
            </Link>
            <Link href="/donate" className="flex items-center text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
              <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Donar
            </Link>
            {status === 'authenticated' && (
              <Link href="/dashboard" className="flex items-center text-white hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
                <UserCircleIcon className="h-5 w-5 mr-2" /> Mi Perfil
              </Link>
            )}
            {status === 'loading' ? (
              <span className="text-white text-base px-3 py-2">Cargando...</span>
            ) : session ? (
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); toggleMenu(); }}
                className="w-full text-left flex items-center bg-white text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-md font-semibold transition-colors duration-200 text-base"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Cerrar Sesión
              </button>
            ) : (
              // CAMBIO CLAVE AQUÍ: Usamos Link para ir a la página de login
              <Link 
                href="/login" 
                className="w-full text-left flex items-center bg-white text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-md font-semibold transition-colors duration-200 text-base"
                onClick={toggleMenu} // Cierra el menú móvil al hacer clic
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}