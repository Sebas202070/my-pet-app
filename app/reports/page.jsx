// src/app/reports/page.jsx
import Link from 'next/link'; 
import ReportCard from '/components/ReportCard'; // Asegúrate de que esta ruta sea correcta

export const metadata = {
  title: 'Mascotas Solidarias Misiones - Reportes',
  description: 'Explora todos los reportes de mascotas perdidas, encontradas, en apuros o que necesitan hogar en Misiones, Argentina.',
};

// Función para obtener todos los reportes desde nuestra API Route
async function getAllReports() {
  console.log("Frontend: getAllReports - Iniciando fetch de todos los reportes.");
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fetchUrl = `${baseUrl}/api/reports`;
    console.log(`Frontend: getAllReports - URL de fetch: ${fetchUrl}`);

    const res = await fetch(fetchUrl, { 
      next: { revalidate: 70 } 
    });

    if (!res.ok) {
      const errorBody = await res.text(); // Leer el cuerpo de la respuesta para ver el HTML de error
      console.error(`Frontend: getAllReports - Failed to fetch reports: ${res.status} ${res.statusText}. Response body:`, errorBody);
      throw new Error(`Failed to fetch reports: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Frontend: getAllReports - Datos de reportes recibidos:", data);
    return data.reports; 
  } catch (error) {
    console.error('Frontend: getAllReports - Error fetching reports:', error);
    return []; 
  }
}

export default async function ReportsPage() {
  const reports = await getAllReports();
  console.log("Frontend: ReportsPage - Reportes para renderizar:", reports);

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