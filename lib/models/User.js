
// src/lib/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Para hashear contraseñas

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Por favor, ingresa un email válido'], // Validación de formato de email
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Puedes definir roles, ej. 'user', 'admin'
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Si la contraseña no ha sido modificada, no la hashees de nuevo
  }
  try {
    const salt = await bcrypt.genSalt(10); // Genera un "salt" para el hasheo
    this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;