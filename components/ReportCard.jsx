
// src/components/ReportCard.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, CalendarIcon, HeartIcon, ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline'; // Iconos de ejemplo

export default function ReportCard({ report }) {
  if (!report) {
    return null; // No renderizar si no hay datos de reporte
  }

  // Función auxiliar para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha desconocida';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  // Determinar el título principal y el icono basado en el tipo de reporte
  let typeTitle = '';
  let icon = null;
  let statusColor = 'bg-gray-200 text-gray-800'; // Color por defecto
  let statusText = 'Activo';

  switch (report.reportType) {
    case 'perdida':
      typeTitle = 'Mascota Perdida';
      icon = <MapPinIcon className="h-5 w-5 mr-1 text-red-500" />;
      statusColor = 'bg-red-100 text-red-700';
      statusText = 'Perdida';
      break;
    case 'encontrada':
      typeTitle = 'Mascota Encontrada';
      icon = <HeartIcon className="h-5 w-5 mr-1 text-green-500" />;
      statusColor = 'bg-green-100 text-green-700';
      statusText = 'Encontrada';
      break;
    case 'apuros':
      typeTitle = 'Mascota en Apuros';
      icon = <ExclamationTriangleIcon className="h-5 w-5 mr-1 text-yellow-500" />;
      statusColor = 'bg-yellow-100 text-yellow-700';
      statusText = `Urgencia: ${report.urgency || 'media'}`;
      break;
    case 'necesita_hogar':
      typeTitle = 'Mascota Necesita Hogar';
      icon = <HomeIcon className="h-5 w-5 mr-1 text-blue-500" />;
      statusColor = 'bg-blue-100 text-blue-700';
      statusText = 'En Adopción';
      break;
    default:
      typeTitle = 'Reporte de Mascota';
      break;
  }

  // Determinar la fecha relevante a mostrar
  let relevantDate = '';
  if (report.reportType === 'perdida') {
    relevantDate = `Perdida el: ${formatDate(report.lostDate)}`;
  } else if (report.reportType === 'encontrada') {
    relevantDate = `Encontrada el: ${formatDate(report.foundDate)}`;
  } else {
    relevantDate = `Publicado el: ${formatDate(report.postedAt)}`;
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={`/reports/${report._id}`}> {/* Enlace a la página de detalle del reporte */}
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <Image
            src={report.photoUrl || '/images/default-pet.png'} // Imagen por defecto si no hay foto
            alt={report.title || 'Mascota'}
            fill // Ocupa todo el espacio del contenedor padre
            style={{ objectFit: 'cover' }} // Asegura que la imagen cubra el área sin distorsionarse
            className="transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimización de imágenes
          />
          <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            {icon}
            <span className="font-semibold">{typeTitle}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
            {report.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2"> {/* Limita la descripción a 2 líneas */}
            {report.description}
          </p>

          <div className="text-gray-700 text-sm mb-2 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span>{report.location}</span>
          </div>
          <div className="text-gray-700 text-sm flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            <span>{relevantDate}</span>
          </div>
        </div>
      </Link>

      <div className="p-4 border-t border-gray-100">
        <Link
          href={`/reports/${report._id}`}
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}