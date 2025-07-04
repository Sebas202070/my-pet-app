// src/app/page.jsx
import Link from 'next/link';
import Image from 'next/image';
import ReportCard from '/components/ReportCard'; // Asegúrate de que esta ruta sea correcta

// Iconos para la sección "Cómo Puedes Ayudar"
import { HeartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, PawPrintIcon as HeroPawPrint } from '@heroicons/react/20/solid'; 

// Placeholder para PawPrintIcon si no tienes un SVG personalizado
const PawPrintIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.5 2 7 3.5 7 6c0 1.5.5 2.5 1 3.5c-.5 1-1 2-1 3.5c0 2.5 2.5 4 5 4s5-1.5 5-4c0-1.5-.5-2.5-1-3.5c.5-1 1-2 1-3.5c0-2.5-2.5-4-5-4zm-4 7c.5-1 1-2 1-3.5c0-1.5-1-2.5-2-3c-.5.5-1 1-1 2.5c0 1.5.5 2.5 1 3.5zM16 9c-.5-1-1-2-1-3.5c0-1.5 1-2.5 2-3c.5.5 1 1 1 2.5c0 1.5-.5 2.5-1 3.5zM12 17c-2 0-3-1-3-2.5c0-1.5.5-2.5 1-3.5c.5.5 1 1 1 2c0 .5-.5 1-1 1.5c.5.5 1 1 1.5 1.5c.5-.5 1-1 1.5-1.5c-.5-.5-1-1-1-1.5c0-1 .5-1.5 1-2c.5 1 .5 2 0 3.5c-1 1-2 1-3 0zm-2-7c-.5-.5-1-1-1-1.5c0-.5.5-1 1-1.5c.5 0 1 .5 1 1s-.5 1-1 2zM14 10c.5-.5 1-1 1-1.5c0-.5-.5-1-1-1.5c-.5 0-1 .5-1 1s.5 1 1 2z"/>
  </svg>
);

export const metadata = {
  title: 'Mascotas Solidarias Misiones - Inicio',
  description: 'Plataforma para reportar y ayudar a mascotas perdidas, encontradas, en apuros o que necesitan hogar en Misiones, Argentina.',
};

async function getUrgentReports() {
  console.log("Frontend: getUrgentReports - Iniciando fetch de reportes urgentes.");
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fetchUrl = `${baseUrl}/api/reports/urgent`;
    console.log(`Frontend: getUrgentReports - URL de fetch: ${fetchUrl}`);

    const res = await fetch(fetchUrl, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorBody = await res.text(); // Leer el cuerpo de la respuesta para ver el HTML de error
      console.error(`Frontend: getUrgentReports - Failed to fetch urgent reports: ${res.status} ${res.statusText}. Response body:`, errorBody);
      return [];
    }
    const data = await res.json();
    console.log("Frontend: getUrgentReports - Datos de reportes urgentes recibidos:", data);
    return data;
  } catch (error) {
    console.error('Frontend: getUrgentReports - Error fetching urgent reports:', error);
    return [];
  }
}

export default async function HomePage() {
  const urgentReports = await getUrgentReports();
  console.log("Frontend: HomePage - Reportes urgentes para renderizar:", urgentReports);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> 
      <main className="flex-grow">
        {/* Sección Hero o Destacada */}
        <section className="bg-gradient-to-br from-blue-700 to-purple-800 text-white py-24 px-4 text-center relative overflow-hidden shadow-lg ">
          {/* Fondo abstracto con formas de patitas/ondas más sutiles y dinámicas */}
          <div className="absolute inset-0 z-0 opacity-15" style={{ 
            backgroundImage: 'url(/images/paw-pattern.svg)', 
            backgroundSize: 'contain', 
            backgroundRepeat: 'repeat',
            animation: 'floatBackground 60s infinite linear' 
          }}></div>
          
          <div className="container mx-auto relative z-10 flex flex-col items-center -mt-10">
            <SparklesIcon className="h-16 w-16 text-yellow-300 mb-4 animate-pulse-slow" /> 
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-down drop-shadow-2xl leading-tight">
              **Mascotas Solidarias Misiones**
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-10 leading-relaxed animate-fade-in-up opacity-90">
              Tu plataforma para reportar y ayudar a mascotas perdidas, encontradas, en apuros o que necesitan un hogar.
            </p>

            {/* Imagen central */}
            <div className="mb-14 animate-fade-in-up delay-200">
              <Image
                src="/images/mujer-jugando-con-perros-de-rescate-en-el-refugio.jpg"
                alt="Mujer jugando con perros de rescate en el refugio"
                width={900} 
                height={550} 
                priority
                className="rounded-3xl shadow-2xl mx-auto border-8 border-white/60 transform hover:scale-102 transition-transform duration-500 ease-in-out cursor-pointer"
              />
            </div>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fade-in-up delay-400">
              <Link href="/reports/new" className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-xl border-b-4 border-blue-800">
                <span className="mr-2">🐾</span> Reportar una Mascota
              </Link>
              <Link href="/reports" className="inline-flex items-center justify-center bg-blue-700 text-white border-2 border-white hover:bg-blue-800 font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-xl border-b-4 border-white/50">
                <span className="mr-2">🔎</span> Ver Todos los Reportes
              </Link>
            </div>

            {/* Sección de Estadísticas - Visible y Vibrante */}
            <div className="w-full max-w-5xl text-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30 animate-fade-in-up delay-600"> 
              <p className="text-3xl font-bold mb-8 drop-shadow-md text-black"> 
                ¡Nuestro Impacto en Misiones!
              </p> 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
                <div className="flex flex-col items-center p-6 rounded-2xl bg-white bg-opacity-15 shadow-md border border-white/30 transition-all duration-300 hover:bg-opacity-25 hover:shadow-lg"> 
                  <p className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-2 drop-shadow-lg">123</p> 
                  <p className="text-lg md:text-xl font-semibold text-gray-700">Mascotas Rescatadas</p> 
                </div> 
                <div className="flex flex-col items-center p-6 rounded-2xl bg-white bg-opacity-15 shadow-md border border-white/30 transition-all duration-300 hover:bg-opacity-25 hover:shadow-lg"> 
                  <p className="text-5xl md:text-6xl font-extrabold text-green-800 mb-2 drop-shadow-lg">45</p> 
                  <p className="text-lg md:text-xl font-semibold text-gray-700">Adopciones Exitosas</p> 
                </div> 
                <div className="flex flex-col items-center p-6 rounded-2xl bg-white bg-opacity-15 shadow-md border border-white/30 transition-all duration-300 hover:bg-opacity-25 hover:shadow-lg"> 
                  <p className="text-5xl md:text-6xl font-extrabold text-yellow-800 mb-2 drop-shadow-lg">77</p> 
                  <p className="text-lg md:text-xl font-semibold text-gray-700">Mascotas Reunidas</p> 
                </div> 
              </div> 
            </div> 
          </div>
        </section>

        {/* --- */}
        {/* Sección de Mascotas Urgentes */}
        <section className="py-20 px-4 bg-gray-100 text-gray-800 shadow-inner">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 animate-fade-in-down">
              <span className="text-red-600">¡Urgente!</span> Mascotas que Necesitan Ayuda Ahora
            </h2>
            {urgentReports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {urgentReports.map(report => (
                  <ReportCard key={report._id} report={report} /> 
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-gray-700 mb-4">
                  No hay reportes urgentes disponibles en este momento. ¡Sé el primero en reportar uno!
                </p>
                <Link href="/reports/new" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                  Reportar una Mascota Ahora
                </Link>
              </div>
            )}
            <div className="text-center mt-16">
              <Link href="/reports?filter=urgent" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:-translate-y-1 text-lg">
                Ver Todas las Mascotas Urgentes <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* --- */}
        {/* Sección Cómo Puedes Ayudar */}
        <section className="py-20 px-4 bg-white text-gray-800">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-14 animate-fade-in-down">
              ¿Cómo Puedes Ser un Héroe?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 border-2 border-blue-100 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
                <PawPrintIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" /> 
                <h3 className="text-2xl font-bold mb-3 text-blue-800">Reporta un Caso</h3>
                <p className="text-gray-700 leading-relaxed">Si encuentras una mascota en apuros, perdida o que necesita un hogar, tu reporte puede cambiar su vida. ¡Es rápido y fácil!</p>
                <Link href="/reports/new" className="mt-6 inline-block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Reportar ahora <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="p-8 border-2 border-red-100 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-red-50 to-red-100">
                <HeartIcon className="h-16 w-16 text-red-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-red-800">Adopta o Rescata</h3>
                <p className="text-gray-700 leading-relaxed">Ofrece un hogar temporal o permanente. Cada adopción salva dos vidas: la del adoptado y la que ocupa su lugar en el refugio.</p>
                <Link href="/adoptions" className="mt-6 inline-block text-red-600 hover:text-red-800 font-semibold transition-colors">
                  Conocer Mascotas <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="p-8 border-2 border-green-100 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
                <CurrencyDollarIcon className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-green-800">Haz una Donación</h3>
                <p className="text-gray-700 leading-relaxed">Tu apoyo económico es vital para cubrir gastos de alimentación, atención veterinaria y rescates urgentes. ¡Cualquier aporte suma!</p>
                <Link href="/donate" className="mt-6 inline-block text-green-600 hover:text-green-800 font-semibold transition-colors">
                  Donar ahora <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}