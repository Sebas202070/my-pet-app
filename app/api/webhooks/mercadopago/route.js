// src/app/api/webhooks/mercadopago/route.js
import { NextResponse } from 'next/server';
import mercadopago from 'mercadopago'; // Importa el SDK de Mercado Pago
import dbConnect from '@/lib/db'; // Para conectar a la base de datos
import Donation from '@/lib/models/Donation'; // Necesitarás un modelo para guardar las donaciones

// Configura Mercado Pago con tu Access Token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Webhook de Mercado Pago recibido:', body);

    // Mercado Pago envía diferentes tipos de notificaciones.
    // La que nos interesa para los pagos es 'payment' o 'merchant_order'.
    // Para simplificar, nos enfocaremos en 'payment'.
    if (body.type === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id;

      // Paso 1: Obtener detalles del pago directamente de Mercado Pago
      const payment = await mercadopago.payment.findById(paymentId);
      const paymentStatus = payment.body.status; // 'approved', 'rejected', 'pending', etc.
      const paymentAmount = payment.body.transaction_amount;
      const paymentCurrency = payment.body.currency_id;
      const preferenceId = payment.body.preference_id; // Si quieres enlazarlo a la preferencia creada

      console.log(`Detalles del pago ${paymentId}: Estado: ${paymentStatus}, Monto: ${paymentAmount} ${paymentCurrency}`);

      // Paso 2: Conectar a la base de datos y guardar/actualizar el estado de la donación
      await dbConnect();

      // Aquí podrías guardar la información de la donación en tu DB
      // Para esto, NECESITAMOS un MODELO de Mongoose para Donaciones.
      // Si ya tuvieras un registro previo (ej., cuando se creó la preferencia), podrías actualizarlo.
      // Por ahora, crearemos uno nuevo.

      await Donation.create({
        paymentId: paymentId,
        preferenceId: preferenceId, // Opcional, para vincular con la preferencia de frontend
        amount: paymentAmount,
        currency: paymentCurrency,
        status: paymentStatus,
        // Otros datos relevantes que quieras guardar
        // Por ejemplo, el ID del usuario si tuvieras autenticación
        // payment_type: payment.body.payment_type_id,
        // method: payment.body.payment_method_id,
        // payer_email: payment.body.payer.email,
        // date_created: payment.body.date_created,
        // date_approved: payment.body.date_approved,
      });

      console.log(`Donación ${paymentId} con estado '${paymentStatus}' guardada en la base de datos.`);

      // Paso 3 (Opcional): Realizar otras acciones
      // - Enviar un email de confirmación al donante
      // - Actualizar estadísticas de donaciones en tu dashboard
      // - Notificar a un equipo interno

    } else if (body.topic === 'merchant_order' && body.resource) {
      // Manejar notificaciones de órdenes de compra (opcional, para casos más complejos)
      console.log('Webhook de Merchant Order recibido. Procesamiento omitido para este ejemplo.');
    }

    // Es CRUCIAL devolver un 200 OK a Mercado Pago para indicar que la notificación fue recibida y procesada.
    // Si no devuelves 200, Mercado Pago reintentará la notificación.
    return NextResponse.json({ message: 'Webhook procesado con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error);
    // Devuelve un error 500 si hubo un problema, para que Mercado Pago reintente la notificación.
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el webhook.', details: error.message },
      { status: 500 }
    );
  }
}