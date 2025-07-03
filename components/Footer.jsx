
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'; // Asegúrate de instalar react-icons si los usas

// Si no quieres instalar react-icons, puedes usar SVG simples como en el Header,
// o simplemente no incluir los iconos de redes sociales por ahora.
// Para instalar react-icons: npm install react-icons

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto"> {/* 'mt-auto' empuja el footer al final */}
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Logo o Nombre de la Aplicación en el Footer */}
          <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
            Mascotas Solidarias
          </Link>

          {/* Enlaces de Navegación del Footer */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg">
            <Link href="/about" className="hover:text-blue-400 transition duration-200">
              Acerca de
            </Link>
            <Link href="/contact" className="hover:text-blue-400 transition duration-200">
              Contacto
            </Link>
            <Link href="/privacy-policy" className="hover:text-blue-400 transition duration-200">
              Política de Privacidad
            </Link>
            <Link href="/terms-of-service" className="hover:text-blue-400 transition duration-200">
              Términos de Servicio
            </Link>
          </div>

          {/* Iconos de Redes Sociales */}
          <div className="flex justify-center space-x-6 mt-6 md:mt-0">
            <a href="https://facebook.com/tupagina" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com/tuperfil" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com/tuperfil" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-200">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-gray-400 text-sm">
          <p>&copy; {currentYear} Mascotas Solidarias Misiones. Todos los derechos reservados.</p>
          <p className="mt-2">Hecho con ❤️ para la comunidad de Misiones.</p>
        </div>
      </div>
    </footer>
  );
}