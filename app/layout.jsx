
import './globals.css'; // Asegúrate de importar tus estilos globales (incluye Tailwind)
import { Inter } from 'next/font/google'; // Importa una fuente de Google (opcional)
import SessionProviderWrapper from '/components/SessionProviderWrapper'; // Importa el wrapp
import Header from '/components/Header';
import Footer from '/components/Footer';


// Configuración de la fuente Inter (puedes elegir otra o no usar ninguna)
const inter = Inter({ subsets: ['latin'] });

// Metadatos de la aplicación para SEO
export const metadata = {
  title: 'Mascotas Solidarias Misiones',
  description: 'Plataforma para reportar y ayudar a mascotas perdidas, encontradas, en apuros o que necesitan hogar en Misiones, Argentina.',
  keywords: ['mascotas', 'perdidas', 'encontradas', 'adopcion', 'ayuda', 'Misiones', 'Argentina'],
  authors: [{ name: 'Tu Nombre/Equipo' }],
  openGraph: {
    title: 'Mascotas Solidarias Misiones',
    description: 'Ayuda a las mascotas de Misiones: reporta, busca y colabora.',
    url: 'https://mascotas-solidarias.com.ar', // Cambia por tu dominio real
    siteName: 'Mascotas Solidarias Misiones',
    images: [
      {
        url: 'https://mascotas-solidarias.com.ar/og-image.jpg', // Imagen para redes sociales
        width: 1200,
        height: 630,
        alt: 'Mascotas Solidarias Misiones',
      },
    ],
    locale: 'es_AR', // Ajusta la localización
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mascotas Solidarias Misiones',
    description: 'Ayuda a las mascotas de Misiones: reporta, busca y colabora.',
    creator: '@tu_usuario_twitter', // Tu usuario de Twitter
    images: ['https://mascotas-solidarias.com.ar/twitter-image.jpg'], // Imagen para Twitter
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        {/* Envuelve toda la aplicación con SessionProviderWrapper */}
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}