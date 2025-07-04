// src/app/api/reports/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db';
import Report from '/lib/models/Report';
import { getServerSession } from 'next-auth';
import { authOptions } from '/lib/auth'; // Tus opciones de NextAuth.js
import { ObjectId } from 'mongodb'; // Para trabajar con ObjectIds de MongoDB

// Función para obtener un reporte por ID (individual)
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de reporte inválido.' }, { status: 400 });
    }

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener el reporte.', details: error.message },
      { status: 500 }
    );
  }
}

// Función para actualizar un reporte (requiere autenticación y autorización)
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de reporte inválido.' }, { status: 400 });
    }

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado.' }, { status: 404 });
    }

    // Autorización: Solo el propietario puede actualizar el reporte
    if (report.ownerId && report.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso para actualizar este reporte.' }, { status: 403 });
    }

    const body = await request.json();
    const updatedReport = await Report.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedReport) {
      return NextResponse.json({ error: 'Error al actualizar el reporte.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Reporte actualizado con éxito', report: updatedReport }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json(
        { error: 'Error de validación al actualizar el reporte', details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar el reporte.', details: error.message },
      { status: 500 }
    );
  }
}

// Función para eliminar un reporte (requiere autenticación y autorización)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de reporte inválido.' }, { status: 400 });
    }

    const report = await Report.findById(id);

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado.' }, { status: 404 });
    }

    // Autorización: Solo el propietario puede eliminar el reporte
    if (report.ownerId && report.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso para eliminar este reporte.' }, { status: 403 });
    }

    await Report.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Reporte eliminado con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el reporte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al eliminar el reporte.', details: error.message },
      { status: 500 }
    );
  }
}