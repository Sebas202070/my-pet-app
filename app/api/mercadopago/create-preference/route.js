// src/app/api/mercadopago/create-preference/route.js
import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago'; // Importa el SDK de Mercado Pago

// Configura Mercado Pago con tu Access Token
// Es CRUCIAL que este token SOLO se use en el backend (lado del servidor).
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
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

    // Crea un objeto de preferencia para Mercado Pago
    const preference = {
      items: [
        {
          title: description || 'Donación a Mascotas Solidarias',
          unit_price: Number(amount),
          quantity: 1,
        },
      ],
      // URLs a las que Mercado Pago redirigirá después del pago
      // Estas son CRÍTICAS para el flujo de pago.
      // Asegúrate de que NEXT_PUBLIC_BASE_URL esté correctamente configurada en .env.local
      // y en tu entorno de producción (ej. Vercel)
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/success`, // Página de éxito
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/failure`, // Página de fallo
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/donate/pending`, // Página de pendiente
      },
      auto_return: 'approved_on_failure', // Redirige automáticamente al usuario después del pago
      binary_mode: false, // Puedes cambiar a true si solo quieres pagos aprobados/rechazados
      // Para recibir notificaciones del estado del pago (IPN - Instant Payment Notification)
      // Esta URL debe ser accesible públicamente por Mercado Pago
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
    };

    const response = await mercadopago.preferences.create(preference);
    const { id, init_point } = response.body; // id es el ID de la preferencia, init_point es la URL de pago

    return NextResponse.json({ id, init_point }, { status: 200 });
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la donación.', details: error.message },
      { status: 500 }
    );
  }
}