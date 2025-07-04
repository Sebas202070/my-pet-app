// src/lib/models/Report.js
import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  // Campos Generales y Obligatorios para todos los reportes
  reportType: { // Tipo de reporte: perdida, encontrada, apuros, necesita_hogar
    type: String,
    enum: ['perdida', 'encontrada', 'apuros', 'necesita_hogar'],
    required: [true, 'El tipo de reporte es obligatorio.'],
  },
  title: { // Título corto del reporte (ej: "Perrita perdida en Palermo")
    type: String,
    required: [true, 'El título es obligatorio.'],
    maxlength: [100, 'El título no puede exceder los 100 caracteres.'],
  },
  description: { // Descripción detallada del caso
    type: String,
    required: [true, 'La descripción es obligatoria.'],
    maxlength: [1000, 'La descripción no puede exceder los 1000 caracteres.'],
  },
  species: { // Especie de la mascota (ej: 'perro', 'gato', 'ave', 'otro')
    type: String,
    enum: ['perro', 'gato', 'ave', 'otro'],
    required: [true, 'La especie de la mascota es obligatoria.'],
  },
  breed: { // Raza de la mascota (opcional)
    type: String,
    maxlength: [50, 'La raza no puede exceder los 50 caracteres.'],
  },
  age: { // Edad estimada (ej: 'cachorro', 'joven', 'adulto', 'mayor')
    type: String,
    enum: ['cachorro', 'joven', 'adulto', 'mayor', 'desconocida'],
  },
  gender: { // Género (ej: 'macho', 'hembra', 'desconocido')
    type: String,
    enum: ['macho', 'hembra', 'desconocido'],
  },
  color: { // Color de la mascota
    type: String,
    maxlength: [50, 'El color no puede exceder los 50 caracteres.'],
  },
  location: { // Ubicación principal del reporte (ej: barrio, calle y número aproximado)
    type: String,
    required: [true, 'La ubicación es obligatoria.'],
    maxlength: [200, 'La ubicación no puede exceder los 200 caracteres.'],
  },
  // Opcional: coordenadas geográficas para el mapa
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  contactPhone: { // Teléfono de contacto del reportante
    type: String,
    required: [true, 'Un teléfono de contacto es obligatorio.'],
    maxlength: [20, 'El teléfono no puede exceder los 20 caracteres.'],
  },
  contactEmail: { // Email de contacto del reportante (opcional)
    type: String,
    match: [/.+@.+\..+/, 'Por favor, usa un email válido.'],
  },
  photoUrl: { // URL de la foto de la mascota (ej: de Cloudinary)
    type: String,
    required: [true, 'La foto de la mascota es obligatoria.'],
  },
  postedAt: { // Fecha y hora de creación del reporte
    type: Date,
    default: Date.now,
  },
  // Campo de urgencia (principalmente para 'apuros', pero puede ser general)
  urgency: {
    type: String,
    enum: ['bajo', 'medio', 'alto'], // <--- ¡Asegúrate de que tus datos en DB coincidan con estos!
    default: 'medio',
  },
  status: { // Estado del reporte (activo, resuelto, archivado)
    type: String,
    enum: ['activo', 'resuelto', 'archivado'],
    default: 'activo',
  },

  // --- Campos Específicos por Tipo de Reporte ---

  // Para 'perdida'
  lostDate: { // Fecha en que se perdió la mascota
    type: Date,
    required: function() { return this.reportType === 'perdida'; }
  },
  lastSeenLocation: { // Último lugar específico donde fue vista
    type: String,
    maxlength: [200, 'La ubicación no puede exceder los 200 caracteres.'],
    required: function() { return this.reportType === 'perdida'; }
  },
  collarInfo: { // Descripción del collar/chapa
    type: String,
    maxlength: [100, 'La información del collar no puede exceder los 100 caracteres.'],
  },
  reward: { // Recompensa ofrecida (opcional)
    type: Number,
  },

  // Para 'encontrada'
  foundDate: { // Fecha en que se encontró la mascota
    type: Date,
    required: function() { return this.reportType === 'encontrada'; }
  },
  foundExactLocation: { // Lugar exacto del hallazgo
    type: String,
    maxlength: [200, 'La ubicación no puede exceder los 200 caracteres.'],
    required: function() { return this.reportType === 'encontrada'; }
  },
  canRetainTemporarily: { // Si el reportante puede quedarse con ella temporalmente
    type: Boolean,
    default: false,
    required: function() { return this.reportType === 'encontrada' || this.reportType === 'apuros'; }
  },

  // Para 'apuros' (accidentada/enferma/peligro)
  injuryDetails: { // Descripción de la lesión o situación de peligro
    type: String,
    maxlength: [500, 'Los detalles de la lesión no pueden exceder los 500 caracteres.'],
    required: function() { return this.reportType === 'apuros'; }
  },
  medicalAttentionNeeded: { // Si necesita atención médica urgente
    type: Boolean,
    default: false,
  },

  // Para 'necesita_hogar' (adopción/tránsito)
  temperament: { // Descripción del temperamento de la mascota
    type: String,
    maxlength: [500, 'El temperamento no puede exceder los 500 caracteres.'],
    required: function() { return this.reportType === 'necesita_hogar'; }
  },
  isNeutered: { // Si está castrada/o
    type: Boolean,
    default: false,
  },
  isVaccinated: { // Si está vacunada/o
    type: Boolean,
    default: false,
  },
  isDewormed: { // Si está desparasitada/o
    type: Boolean,
    default: false,
  },
  healthStatus: { // Estado general de salud
    type: String,
    maxlength: [200, 'El estado de salud no puede exceder los 200 caracteres.'],
  },
  reasonForSeekingHome: { // Razón por la que busca hogar (ej: rescate, abandono, dueño no puede cuidarla)
    type: String,
    maxlength: [200, 'La razón no puede exceder los 200 caracteres.'],
    required: function() { return this.reportType === 'necesita_hogar'; }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },
}, { timestamps: true }); 

// Evita la recompilación del modelo si ya existe
const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default Report; // <--- ¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ ASÍ!