// src/app/api/reports/urgent/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db'; // Asegúrate de que esta ruta sea correcta
import Report from '/lib/models/Report'; // Asegúrate de que esta ruta sea correcta

export async function GET() {
  await dbConnect();

  try {
    // Definimos los tipos de reporte que consideramos "urgentes"
    // Incluyo 'apuros' y 'necesita_hogar' como los principales urgentes.
    const urgentTypes = ['apuros', 'necesita_hogar'];

    // Buscamos reportes que sean de tipo "apuros" o "necesita_hogar"
    // y que no estén marcados como resueltos (asumo un campo 'isResolved' o similar en tu modelo)
    const urgentReports = await Report.find({
      reportType: { $in: urgentTypes },
      // Puedes añadir un filtro aquí para reportes no resueltos, por ejemplo:
      // status: 'activo' // O 'isResolved: false' en tu modelo, si lo tienes
    })
    .sort({ postedAt: -1 }) // Ordena por los más recientes primero
    .limit(6) // Limita el número de reportes a recuperar para el home (ajusta este número si quieres más o menos)
    .lean(); // Para obtener objetos JavaScript planos

    // Prepara los datos para la respuesta, asegurando que sean serializables
    const serializableReports = urgentReports.map(report => ({
      // Asegúrate de incluir todos los campos que tu ReportCard utiliza.
      _id: report._id.toString(),
      title: report.title,
      description: report.description,
      photoUrl: report.photoUrl,
      reportType: report.reportType,
      location: report.location,
      postedAt: report.postedAt.toISOString(),
      lostDate: report.lostDate ? report.lostDate.toISOString() : null, // Incluye lostDate si existe
      foundDate: report.foundDate ? report.foundDate.toISOString() : null, // Incluye foundDate si existe
      urgency: report.urgency || null, // Para el tipo 'apuros'
      // Añade aquí cualquier otro campo que ReportCard pueda necesitar, como species, age, contactPhone si los usas para mostrar en la tarjeta.
      species: report.species || null,
      age: report.age || null,
      gender: report.gender || null,
      contactPhone: report.contactPhone || null,
    }));

    // Opcional: Shuffle para que las tarjetas sean aleatorias cada vez que se cargue la página
    // Esto es útil si tienes más reportes urgentes de los que muestras.
    const shuffledReports = serializableReports.sort(() => 0.5 - Math.random());

    return NextResponse.json(shuffledReports, { status: 200 });

  } catch (error) {
    console.error('Error al obtener reportes urgentes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener reportes urgentes', details: error.message },
      { status: 500 }
    );
  }
}