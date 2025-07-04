// src/app/reports/page.jsx
import Link from 'next/link'; 
import ReportCard from '/components/ReportCard'; // Asegúrate de que esta ruta sea correcta

export const metadata = {
  title: 'Mascotas Solidarias Misiones - Reportes',
  description: 'Explora todos los reportes de mascotas perdidas, encontradas, en apuros o que necesitan hogar en Misiones, Argentina.',
};

// Función para obtener todos los reportes desde nuestra API Route
async function getAllReports() {
  try {
    // --- CORRECCIÓN CLAVE 1: Usa NEXT_PUBLIC_BASE_URL para que funcione en producción ---
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 
    
    // Si NEXT_PUBLIC_BASE_URL no está definido (ej. en desarrollo sin .env.local), usa localhost
    // En producción, Vercel u otros hosts lo definirán automáticamente a tu dominio.
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_BASE_URL no está definido. Usando http://localhost:3000.");
    }
    const fetchUrl = `${baseUrl || 'http://localhost:3000'}/api/reports`;

    const res = await fetch(fetchUrl, { 
      // --- CORRECCIÓN CLAVE 2: Usa revalidate para permitir la generación estática ---
      // Esto le dice a Next.js que puede cachear esta página por 60 segundos.
      // Después de 60 segundos, si hay una nueva solicitud, Next.js intentará revalidar en el fondo.
      // Esto permite que la página se construya estáticamente pero se mantenga actualizada.
      next: { revalidate: 70 } 
    });

    if (!res.ok) {
      console.error(`Failed to fetch reports: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch reports: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.reports; 
  } catch (error) {
    console.error('Error fetching reports:', error);
    return []; 
  }
}

export default async function ReportsPage() {
  const reports = await getAllReports();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-12 animate-fade-in-down">
          Todos los Reportes de Mascotas
        </h1>

        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">No hay reportes disponibles en este momento.</p>
            <Link href="/reports/new" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Sé el primero en reportar una mascota
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {reports.map(report => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link href="/reports/new" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition-colors transform hover:-translate-y-1 text-lg">
            ¿Encontraste o Perdiste una Mascota? ¡Repórtala! <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
