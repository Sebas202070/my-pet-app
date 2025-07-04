// src/app/api/reports/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db'; // <--- ¡ASEGÚRATE DE QUE ESTO ES '@/lib/db' y NO '/lib/db'!
import Report from '/lib/models/Report'; // <--- ¡ASEGÚRATE DE QUE ESTO ES '@/lib/models/Report' y NO '/lib/models/Report'!
import { getServerSession } from 'next-auth'; 
import { authOptions } from '/lib/auth'; 

export async function POST(request) {
  console.log("API: /api/reports - Petición POST recibida.");
  try {
    await dbConnect(); 
    console.log("API: /api/reports - Conexión a DB exitosa para POST.");
  } catch (dbError) {
    console.error("API: /api/reports - Error al conectar a la DB para POST:", dbError);
    return NextResponse.json(
      { error: 'Error de conexión a la base de datos', details: dbError.message },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    console.log("API: /api/reports - Datos recibidos para crear reporte:", body);
    
    const session = await getServerSession(authOptions);
    let ownerId = null;
    if (session && session.user && session.user.id) {
      ownerId = session.user.id;
      console.log(`API: /api/reports - Usuario autenticado. ownerId: ${ownerId}`);
    } else {
      console.log("API: /api/reports - Usuario no autenticado. El reporte será anónimo.");
    }

    const reportData = { ...body, ownerId: ownerId };

    const report = await Report.create(reportData);
    console.log("API: /api/reports - Reporte creado con éxito en DB:", report);

    return NextResponse.json(
      { message: 'Reporte creado con éxito', report },
      { status: 201 } 
    );
  } catch (error) {
    console.error('API: /api/reports - Error al crear el reporte:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json(
        { error: 'Error de validación', details: errors },
        { status: 400 } 
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 } 
    );
  }
}

export async function GET() {
  console.log("API: /api/reports - Petición GET recibida.");
  try {
    await dbConnect();
    console.log("API: /api/reports - Conexión a DB exitosa para GET.");
  } catch (dbError) {
    console.error("API: /api/reports - Error al conectar a la DB para GET:", dbError);
    return NextResponse.json(
      { error: 'Error de conexión a la base de datos', details: dbError.message },
      { status: 500 }
    );
  }

  try {
    const reports = await Report.find({}).sort({ postedAt: -1 }).lean(); // Añadido .lean() para rendimiento
    console.log(`API: /api/reports - Encontrados ${reports.length} reportes en total.`);

    // Asegurarse de que los reportes sean serializables
    const serializableReports = reports.map(report => ({
      _id: report._id.toString(),
      title: report.title || 'Sin título',
      description: report.description || 'Sin descripción',
      photoUrl: report.photoUrl || '/images/default-pet.png',
      reportType: report.reportType || 'desconocido',
      location: report.location || 'Desconocida',
      postedAt: report.postedAt ? report.postedAt.toISOString() : null,
      lostDate: report.lostDate ? report.lostDate.toISOString() : null,
      foundDate: report.foundDate ? report.foundDate.toISOString() : null,
      urgency: report.urgency || 'baja',
      species: report.species || 'desconocida',
      breed: report.breed || 'desconocida',
      gender: report.gender || 'desconocido',
      age: report.age || 'desconocida',
      contactPhone: report.contactPhone || 'No proporcionado',
      contactEmail: report.contactEmail || 'No proporcionado',
      ownerId: report.ownerId ? report.ownerId.toString() : null, 
      isResolved: report.isResolved || false, 
    }));

    return NextResponse.json({ reports: serializableReports }, { status: 200 });
  } catch (error) {
    console.error('API: /api/reports - Error al obtener los reportes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener reportes', details: error.message },
      { status: 500 }
    );
  }
}