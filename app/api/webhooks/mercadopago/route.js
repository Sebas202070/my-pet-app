// src/app/api/webhooks/mercadopago/route.js
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago'; // Importa las clases modernas
import dbConnect from '@/lib/db'; // Para conectar a la base de datos
import Donation from '@/lib/models/Donation'; // Tu modelo de Mongoose para donaciones
import nodemailer from 'nodemailer'; // Para enviar correos electrónicos
import { ObjectId } from 'mongodb'; // Necesario para buscar por _id de MongoDB

// Configura el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Configura Nodemailer (fuera del handler para que se inicialice una sola vez)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Ej: 'smtp.gmail.com'
  port: Number(process.env.EMAIL_PORT), // Ej: 587 o 465
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const parsedData = await request.json();
    console.log('Webhook de Mercado Pago recibido:', JSON.stringify(parsedData, null, 2));

    // Mercado Pago envía diferentes tipos de notificaciones.
    // La que nos interesa para los pagos es 'payment'.
    if (parsedData.type === 'payment' && parsedData.data && parsedData.data.id) {
      const paymentId = parsedData.data.id;
      console.log('Payment ID recibido:', paymentId);

      // Obtener detalles del pago usando la clase Payment del SDK moderno
      const paymentInstance = new Payment(client);
      const paymentDetails = await paymentInstance.get({ id: paymentId });

      console.log('Payment details:', JSON.stringify(paymentDetails, null, 2));

      const paymentStatus = paymentDetails.status; // 'approved', 'rejected', 'pending', etc.
      const paymentAmount = paymentDetails.transaction_amount;
      const paymentCurrency = paymentDetails.currency_id;
      // El external_reference es el ID de nuestra donación que enviamos al crear la preferencia
      const donationId = paymentDetails.external_reference; 
      const payerEmail = paymentDetails.payer?.email; // Email del pagador

      console.log(`Detalles del pago ${paymentId}: Estado: ${paymentStatus}, Monto: ${paymentAmount} ${paymentCurrency}, Donation ID: ${donationId}`);

      if (!donationId) {
        console.error('Donation ID (external_reference) no encontrado en los detalles del pago.');
        return NextResponse.json({ error: 'Donation ID no encontrado' }, { status: 400 });
      }

      await dbConnect(); // Conectar a la base de datos

      // Actualizar el estado de la donación en la base de datos
      const updateResult = await Donation.findOneAndUpdate(
        { _id: new ObjectId(donationId) }, // Buscar por el ID de la donación
        { 
          $set: { 
            status: paymentStatus, 
            paymentId: paymentId,
            updatedAt: new Date(),
            // Puedes añadir más detalles del pago aquí si los necesitas
            // payerEmail: payerEmail,
            // paymentMethod: paymentDetails.payment_method_id,
            // transactionDetails: paymentDetails.transaction_details,
          } 
        },
        { new: true } // Retorna el documento modificado
      );

      if (!updateResult) {
        console.error(`Donación con ID ${donationId} no encontrada o no actualizada.`);
        return NextResponse.json(
          { error: 'Donación no encontrada o no actualizada' },
          { status: 404 }
        );
      }

      console.log(`Donación ${donationId} actualizada a estado '${paymentStatus}'.`);

      // Enviar correo electrónico de confirmación si el pago fue aprobado
      if (paymentStatus === 'approved') {
        try {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: payerEmail || process.env.EMAIL_USER, // Envía al pagador o a tu propio email si no hay email del pagador
            subject: '¡Gracias por tu donación a Mascotas Solidarias Misiones!',
            html: `
              <p>¡Hola!</p>
              <p>Queremos agradecerte de corazón por tu donación de <strong>$${paymentAmount} ${paymentCurrency}</strong> a Mascotas Solidarias Misiones.</p>
              <p>Tu aporte (ID de pago: ${paymentId}) es fundamental para seguir ayudando a los animales que más lo necesitan en nuestra provincia.</p>
              <p>Con tu ayuda, podemos:</p>
              <ul>
                <li>Alimentar y cuidar a mascotas rescatadas.</li>
                <li>Cubrir gastos veterinarios y medicamentos.</li>
                <li>Promover adopciones responsables.</li>
                <li>Realizar campañas de concientización.</li>
              </ul>
              <p>¡Juntos hacemos la diferencia!</p>
              <p>Saludos solidarios,</p>
              <p>El equipo de Mascotas Solidarias Misiones</p>
              <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Visita nuestra web</a></p>
            `,
          };
          
          await transporter.sendMail(mailOptions);
          console.log('Correo electrónico de confirmación de donación enviado.');
        } catch (emailError) {
          console.error('Error al enviar el correo electrónico de confirmación:', emailError);
          // No devolvemos un 500 aquí, ya que el pago ya se procesó en la DB.
          // El error de email es secundario al procesamiento del webhook.
        }
      }

      return NextResponse.json({ message: 'Webhook procesado con éxito.' }, { status: 200 });

    } else {
      console.log('Notificación de Mercado Pago no es de tipo "payment" o falta data.id. Tipo:', parsedData.type);
      return NextResponse.json({ message: 'Tipo de notificación no relevante o datos incompletos.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error al procesar el webhook de Mercado Pago:', error);
    console.error('Pila de llamadas del error:', error.stack);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el webhook.', details: error.message },
      { status: 500 }
    );
  }
}