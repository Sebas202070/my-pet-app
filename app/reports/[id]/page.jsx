// app/reports/[id]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Para manejar casos donde el reporte no existe

// Importar los iconos necesarios
import {
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  CurrencyDollarIcon,
  SparklesIcon, // This one exists
  XCircleIcon, // This one exists
  // PawPrintIcon, // <--- REMOVE THIS LINE, IT DOES NOT EXIST IN HEROICONS
  ShieldCheckIcon,
  // StrollerIcon // <--- REMOVE THIS LINE, IT DOES NOT EXIST IN HEROICONS
  SunIcon // This one exists
} from '@heroicons/react/24/outline';

// Importar el modelo de Reporte directamente para buscar en el servidor
// IMPORTANTE: Ajusta la ruta de importación de dbConnect y Report.
// Si tus carpetas 'lib', 'app', 'components' están directamente en la raíz del proyecto,
// entonces el alias '@/' es la mejor práctica si jsconfig.json está configurado.
import dbConnect from '/lib/db'; // Asegúrate que db.js está en lib/db.js
import Report from '/lib/models/Report'; // Asegúrate que Report.js está en lib/models/Report.js


// Función para obtener los detalles de un reporte específico
async function getReportDetails(id) {
  await dbConnect(); // Conectar a la base de datos

  try {
    // Busca el reporte por ID. Si usas MongoDB, _id es un ObjectId,
    // asegúrate de que el 'id' que viene de params sea válido para MongoDB.
    const report = await Report.findById(id).lean(); // .lean() para obtener un objeto JS plano, más rápido
    
    if (!report) {
      return null; // Si no se encuentra, retorna null
    }

    // Convertir ObjectId a string para que sea serializable en un Server Component
    // (aunque el .lean() ya lo suele hacer, es buena práctica asegurarlo)
    report._id = report._id.toString();
    report.postedAt = report.postedAt.toISOString(); // Asegurar que las fechas sean strings ISO

    // Convertir otras fechas específicas a ISO strings si existen y no lo están ya
    if (report.lostDate && report.lostDate instanceof Date) report.lostDate = report.lostDate.toISOString();
    if (report.foundDate && report.foundDate instanceof Date) report.foundDate = report.foundDate.toISOString();

    return report;
  } catch (error) {
    // Si el ID no es un ObjectId válido (ej. 'abc'), findById lanzará un error.
    // Lo capturamos para evitar un crash y manejamos como 'no encontrado'.
    console.error(`Error al obtener reporte con ID ${id}:`, error);
    return null; // En caso de error (ej. ID inválido), retorna null
  }
}


export const metadata = {
  title: 'Detalles del Reporte de Mascota - Mascotas Solidarias Misiones',
  description: 'Información detallada sobre un reporte de mascota perdida, encontrada o en adopción en Misiones.',
};

export default async function ReportDetailPage({ params }) {
  // CORRECCIÓN CLAVE: Await params antes de desestructurar
  const { id } = await params; // El ID del reporte viene de la URL (ej. /reports/123)

  const report = await getReportDetails(id);

  if (!report) {
    // notFound() es una función de Next.js que renderiza la página 404 por defecto
    // Es una buena práctica para rutas dinámicas cuando el recurso no existe.
    notFound(); 
  }

  // --- Lógica para mostrar la información relevante según el tipo de reporte ---
  // Inicialización de un array para almacenar los detalles específicos de cada tipo de reporte
  let specificDetails = [];
  // Inicialización del badge de estado con valores por defecto
  let statusBadge = { text: 'Activo', color: 'bg-gray-100 text-gray-700' };

  // Usa un switch para poblar 'specificDetails' y 'statusBadge' basado en 'reportType'
  switch (report.reportType) {
    case 'perdida':
      specificDetails.push({ icon: <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Perdida el', value: report.lostDate ? new Date(report.lostDate).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Desconocida' });
      specificDetails.push({ icon: <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Último lugar visto', value: report.lastSeenLocation });
      if (report.collarInfo) specificDetails.push({ icon: <TagIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Información del collar', value: report.collarInfo });
      if (report.reward) specificDetails.push({ icon: <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Recompensa ofrecida', value: `$${report.reward.toLocaleString('es-AR')}` });
      statusBadge = { text: 'Perdida', color: 'bg-red-100 text-red-700' };
      break;
    case 'encontrada':
      specificDetails.push({ icon: <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Encontrada el', value: report.foundDate ? new Date(report.foundDate).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Desconocida' });
      specificDetails.push({ icon: <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Lugar exacto del hallazgo', value: report.foundExactLocation });
      specificDetails.push({ icon: <XCircleIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Puede retenerse temporalmente', value: report.canRetainTemporarily ? 'Sí' : 'No' });
      statusBadge = { text: 'Encontrada', color: 'bg-green-100 text-green-700' };
      break;
    case 'apuros':
      specificDetails.push({ icon: <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Detalles del apuro', value: report.injuryDetails });
      specificDetails.push({ icon: <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Atención médica urgente', value: report.medicalAttentionNeeded ? 'Sí, ¡urgente!' : 'No especificado' });
      specificDetails.push({ icon: <HeartIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Nivel de urgencia', value: report.urgency.charAt(0).toUpperCase() + report.urgency.slice(1) });
      specificDetails.push({ icon: < SunIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Ayuda para trasladar', value: report.canTransportNeeded ? 'Sí' : 'No' }); // Asumo un campo 'canTransportNeeded'
      statusBadge = { text: `En Apuros: ${report.urgency.toUpperCase()}`, color: 'bg-yellow-100 text-yellow-700' };
      break;
    case 'necesita_hogar':
      specificDetails.push({ icon: <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Razón para buscar hogar', value: report.reasonForSeekingHome });
      specificDetails.push({ icon: <SparklesIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Temperamento', value: report.temperament });
      if (report.isNeutered) specificDetails.push({ icon: <SunIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Castrado/a', value: 'Sí' });
      if (report.isVaccinated) specificDetails.push({ icon: <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Vacunado/a', value: 'Sí' });
      if (report.isDewormed) specificDetails.push({ icon: <XCircleIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Desparasitado/a', value: 'Sí' });
      if (report.healthStatus) specificDetails.push({ icon: <HeartIcon className="h-5 w-5 text-gray-500 mr-2" />, label: 'Estado de salud', value: report.healthStatus });
      statusBadge = { text: 'Necesita Hogar', color: 'bg-blue-100 text-blue-700' };
      break;
    default:
      // Si el reportType no coincide con ninguno conocido
      statusBadge = { text: 'Desconocido', color: 'bg-gray-400 text-white' };
      break;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
        {/* Sección de Imagen Principal */}
        <div className="relative w-full h-80 md:h-96 bg-gray-200 flex items-center justify-center">
          {/* Verifica si report.photoUrl existe antes de renderizar Image */}
          {report.photoUrl ? (
            <Image
              src={report.photoUrl}
              alt={report.title || 'Mascota'}
              fill
              style={{ objectFit: 'cover' }}
              priority // Carga la imagen principal rápidamente
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <XCircleIcon className="h-20 w-20 mx-auto mb-4" />
              <p>Imagen no disponible</p>
            </div>
          )}
          
          <span className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {report.title}
          </h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {report.description}
          </p>

          {/* Detalles Generales de la Mascota */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t pt-6">
            <div className="flex items-center text-gray-700">
              <XCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <strong>Especie:</strong> {report.species ? (report.species.charAt(0).toUpperCase() + report.species.slice(1)) : 'N/A'}
            </div>
            {report.breed && (
              <div className="flex items-center text-gray-700">
                <TagIcon className="h-5 w-5 text-blue-600 mr-2" />
                <strong>Raza:</strong> {report.breed}
              </div>
            )}
            {report.age && (
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <strong>Edad:</strong> {report.age.charAt(0).toUpperCase() + report.age.slice(1)}
              </div>
            )}
            {report.gender && (
              <div className="flex items-center text-gray-700">
                <HeartIcon className="h-5 w-5 text-blue-600 mr-2" />
                <strong>Género:</strong> {report.gender.charAt(0).toUpperCase() + report.gender.slice(1)}
              </div>
            )}
            {report.color && (
              <div className="flex items-center text-gray-700">
                <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
                <strong>Color:</strong> {report.color}
              </div>
            )}
            <div className="flex items-center text-gray-700 md:col-span-2">
              <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
              <strong>Ubicación General:</strong> {report.location}
            </div>
          </div>

          {/* Detalles Específicos del Reporte según su tipo */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6">
            Detalles Específicos del Reporte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {specificDetails.map((detail, index) => (
              <div key={index} className="flex items-start text-gray-700">
                {detail.icon}
                <div>
                  <strong>{detail.label}:</strong> {detail.value}
                </div>
              </div>
            ))}
          </div>

          {/* Información de Contacto */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6">
            Información de Contacto
          </h2>
          <div className="space-y-3 mb-6">
            <p className="flex items-center text-lg text-gray-800">
              <PhoneIcon className="h-6 w-6 text-green-600 mr-3" />
              <strong>Teléfono:</strong> <a href={`tel:${report.contactPhone}`} className="text-blue-600 hover:underline ml-2">{report.contactPhone}</a>
            </p>
            {report.contactEmail && (
              <p className="flex items-center text-lg text-gray-800">
                <EnvelopeIcon className="h-6 w-6 text-green-600 mr-3" />
                <strong>Email:</strong> <a href={`mailto:${report.contactEmail}`} className="text-blue-600 hover:underline ml-2">{report.contactEmail}</a>
              </p>
            )}
          </div>

          {/* Botones de Navegación/Acción */}
          <div className="mt-8 flex justify-between">
            <Link href="/reports" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Volver a la Lista
            </Link>
            {/* Ejemplo de botón condicional si quisieras editar o marcar como resuelto */}
            {/* Puedes añadir lógica aquí para verificar si el usuario actual es el autor del reporte */}
            {/* <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors">
              Marcar como Resuelto
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}