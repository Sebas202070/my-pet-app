// src/app/api/mercadopago/create-preference/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '/lib/db'; // Asegúrate de que esta ruta sea correcta
import Donation from '/lib/models/Donation'; // Asegúrate de que esta ruta sea correcta

// Configura el cliente de Mercado Pago con tu Access Token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const { amount, description } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto de donación inválido.' },
        { status: 400 }
      );
    }

    await dbConnect(); // Conectar a la base de datos

    // Paso 1: Crear una donación inicial en la base de datos con estado 'pendiente'
    // Esto nos da un _id para usar como external_reference
    const newDonation = await Donation.create({
      amount: Number(amount),
      description: description || 'Donación a Mascotas Solidarias',
      status: 'pending', // Estado inicial
      // Puedes añadir más campos aquí, como userId si tienes autenticación, fecha, etc.
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Convierte el ObjectId a string para usarlo como external_reference
    const donationId = newDonation._id.toString();

    // Crea una instancia de Preference usando el cliente configurado
    const preference = new Preference(client);

    // Define los ítems para la preferencia de pago
    const items = [
      {
        title: description || 'Donación a Mascotas Solidarias',
        unit_price: Number(amount),
        quantity: 1,
      },
    ];

    // Crea el cuerpo de la preferencia de pago
    const preferenceBody = {
      items: items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/success?donationId=${donationId}`, // Pasa el ID de la donación
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/failure?donationId=${donationId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/pending?donationId=${donationId}`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
      external_reference: donationId, // <--- CRUCIAL: Usamos el ID de la donación
      metadata: {
        donation_id: donationId, // También en metadata para mayor redundancia
      },
    };

    // Crea la preferencia en Mercado Pago
    const response = await preference.create({ body: preferenceBody });
    const { id, init_point } = response; // Con la nueva API, la respuesta ya es el objeto body

    // Devuelve el ID de la preferencia y el init_point (URL de pago)
    return NextResponse.json({ id, init_point, donationId }, { status: 200 });
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la donación.', details: error.message },
      { status: 500 }
    );
  }
}