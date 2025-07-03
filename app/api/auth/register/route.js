// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '/lib/db'; // Importa tu función de conexión a la DB
import User from '/lib/models/User'; // Importa tu modelo de usuario

export async function POST(request) {
  await dbConnect(); // Conecta a la base de datos

  try {
    const { name, email, password } = await request.json();

    // Validaciones básicas del lado del servidor (adicional a las del frontend)
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres.' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado. Por favor, inicia sesión o usa otro email.' },
        { status: 409 } // Conflict
      );
    }

    // Crear el nuevo usuario
    // El middleware .pre('save') en el modelo User se encargará de hashear la contraseña
    const newUser = await User.create({ name, email, password });

    // No devolver la contraseña hasheada en la respuesta
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente.', user: userResponse },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    // Manejo de errores específicos de Mongoose, si es necesario
    if (error.code === 11000) { // Error de clave duplicada (ej. email único)
      return NextResponse.json(
        { error: 'El email ya está registrado.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor al registrar el usuario.', details: error.message },
      { status: 500 }
    );
  }
}