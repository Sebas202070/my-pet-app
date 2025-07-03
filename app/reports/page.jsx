// src/app/reports/page.jsx
import ReportCard from '/components/ReportCard'; // Componente para mostrar cada reporte

// Esta función se ejecuta en el servidor para obtener los datos
async function getReports() {
  try {
    // La URL debe apuntar a tu API Route para obtener reportes
    // En un entorno de producción, usa la URL completa: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/reports'
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`, {
      cache: 'no-store', // Esto asegura que siempre se obtengan los datos más recientes
    });

    if (!res.ok) {
      // Si la respuesta no es OK, lanza un error
      const errorData = await res.json();
      throw new Error(errorData.error || 'Fallo al obtener los reportes.');
    }

    const data = await res.json();
    return data.reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    // Puedes retornar un array vacío o null para manejar el error en el componente
    return [];
  }
}

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        Mascotas que Necesitan Ayuda en Misiones
      </h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No hay reportes de mascotas disponibles en este momento. ¡Sé el primero en <Link href="/reports/new" className="text-blue-600 hover:underline">reportar una</Link>!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report._id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}