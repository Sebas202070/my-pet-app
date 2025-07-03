// src/app/api/reports/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db'; // Asume que tienes un db.js para la conexión
import Report from '/lib/models/Report'; // Tu modelo de Mongoose

export async function POST(request) {
  await dbConnect(); // Conectar a la base de datos

  try {
    const body = await request.json();

    // Crear una nueva instancia del modelo Report con los datos recibidos
    const report = await Report.create(body);

    // Enviar una respuesta de éxito con el reporte creado
    return NextResponse.json(
      { message: 'Reporte creado con éxito', report },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Error al crear el reporte:', error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json(
        { error: 'Error de validación', details: errors },
        { status: 400 } // 400 Bad Request
      );
    }

    // Otros errores del servidor
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    // Obtener todos los reportes de la base de datos
    const reports = await Report.find({}).sort({ postedAt: -1 }); // Ordenar por los más recientes

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener reportes', details: error.message },
      { status: 500 }
    );
  }
}