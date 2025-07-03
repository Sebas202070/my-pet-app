// src/lib/models/Donation.js
import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true, // Cada ID de pago de MP debe ser único
  },
  preferenceId: {
    type: String,
    // Opcional: Para vincular con la preferencia de pago que creaste en el frontend
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'ARS', // Por defecto, pesos argentinos
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back'],
    required: true,
  },
  // Opcional: Si tienes usuarios autenticados, puedes vincular la donación a un usuario
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: false,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Asegura que 'updatedAt' se actualice en cada guardado
DonationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);

export default Donation;