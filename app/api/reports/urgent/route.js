
// src/app/api/reports/urgent/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db'; 
import Report from '/lib/models/Report'; 

export async function GET() {
  console.log("API: /api/reports/urgent (GET) - Petición recibida.");
  try {
    await dbConnect();
    console.log("API: /api/reports/urgent (GET) - Conexión a DB exitosa.");
  } catch (dbError) {
    console.error("API: /api/reports/urgent (GET) - Error al conectar a la DB:", dbError);
    return NextResponse.json(
      { error: 'Error de conexión a la base de datos', details: dbError.message },
      { status: 500 }
    );
  }

  try {
    const urgentTypes = ['apuros', 'necesita_hogar'];
    const urgentLevels = ['medio', 'alto']; // Coincide con tu enum en Report.js

    console.log("API: /api/reports/urgent (GET) - Buscando reportes con tipos:", urgentTypes, "y niveles de urgencia (finales):", urgentLevels);

    // --- PASO DE DEPURACIÓN CRÍTICO: Obtener todos los reportes para inspeccionar ---
    const allReportsInDb = await Report.find({}).lean();
    console.log("API: /api/reports/urgent (GET) - Todos los reportes en DB (para depuración):");
    allReportsInDb.forEach(report => {
      // Ahora inspeccionamos el campo 'status'
      console.log(`  - ID: ${report._id}, Tipo: ${report.reportType}, Urgencia: ${report.urgency}, Status: ${report.status}`);
    });
    // --- FIN PASO DE DEPURACIÓN ---

    const query = {
      reportType: { $in: urgentTypes },
      urgency: { $in: urgentLevels },
      status: 'activo', // <--- ¡CAMBIO CLAVE AQUÍ! Ahora filtra por el campo 'status'
    };

    console.log("API: /api/reports/urgent (GET) - Ejecutando consulta Mongoose:", JSON.stringify(query));

    const urgentReports = await Report.find(query)
    .sort({ postedAt: -1 })
    .limit(6)
    .lean(); 

    console.log(`API: /api/reports/urgent (GET) - Encontrados ${urgentReports.length} reportes urgentes (después de query).`);
    console.log("API: /api/reports/urgent (GET) - Reportes encontrados (raw):", urgentReports);

    const serializableReports = urgentReports.map(report => {
      return {
        _id: report._id.toString(),
        title: report.title || 'Sin título',
        description: report.description || 'Sin descripción',
        photoUrl: report.photoUrl || '/images/default-pet.png',
        reportType: report.reportType || 'desconocido',
        location: report.location || 'Desconocida',
        postedAt: report.postedAt ? report.postedAt.toISOString() : null,
        lostDate: report.lostDate ? report.lostDate.toISOString() : null,
        foundDate: report.foundDate ? report.foundDate.toISOString() : null,
        urgency: report.urgency || 'bajo', 
        species: report.species || 'desconocida',
        breed: report.breed || 'desconocida',
        gender: report.gender || 'desconocido',
        age: report.age || 'desconocida',
        contactPhone: report.contactPhone || 'No proporcionado',
        contactEmail: report.contactEmail || 'No proporcionado',
        ownerId: report.ownerId ? report.ownerId.toString() : null, 
        status: report.status || 'activo', // Aseguramos que el status se incluya en la serialización
      };
    });

    const shuffledReports = serializableReports.sort(() => 0.5 - Math.random());
    console.log("API: /api/reports/urgent (GET) - Retornando JSON de reportes.");
    return NextResponse.json(shuffledReports, { status: 200 });

  } catch (error) {
    console.error('API: /api/reports/urgent (GET) - Error en el bloque principal de la función GET:', error);
    console.error('Detalles del error:', error.message, error.stack);
    
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener reportes urgentes', details: error.message },
      { status: 500 }
    );
  }
}