// src/components/ReportForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Iconos de ejemplo (instala @heroicons/react)

// Asegúrate de instalar heroicons si no los tienes: npm install @heroicons/react

export default function ReportForm({ existingReport = null }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    reportType: '', // 'perdida', 'encontrada', 'apuros', 'necesita_hogar'
    title: '',
    description: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    color: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    photoFile: null, // Para el archivo de imagen que se va a subir
    photoUrl: '', // Para la URL de la imagen ya subida (si estamos editando)
    urgency: 'medio',
    // Campos específicos para cada tipo de reporte
    lostDate: '',
    lastSeenLocation: '',
    collarInfo: '',
    reward: '',
    foundDate: '',
    foundExactLocation: '',
    canRetainTemporarily: false,
    injuryDetails: '',
    medicalAttentionNeeded: false,
    temperament: '',
    isNeutered: false,
    isVaccinated: false,
    isDewormed: false,
    healthStatus: '',
    reasonForSeekingHome: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null); // Para mostrar la vista previa de la imagen

  useEffect(() => {
    if (existingReport) {
      // Formatear fechas si existen para los inputs type="datetime-local" o "date"
      const formattedLostDate = existingReport.lostDate ? new Date(existingReport.lostDate).toISOString().slice(0, 16) : '';
      const formattedFoundDate = existingReport.foundDate ? new Date(existingReport.foundDate).toISOString().slice(0, 16) : '';

      setFormData({
        reportType: existingReport.reportType || '',
        title: existingReport.title || '',
        description: existingReport.description || '',
        species: existingReport.species || '',
        breed: existingReport.breed || '',
        age: existingReport.age || '',
        gender: existingReport.gender || '',
        color: existingReport.color || '',
        location: existingReport.location || '',
        contactPhone: existingReport.contactPhone || '',
        contactEmail: existingReport.contactEmail || '',
        photoFile: null, // No se carga un archivo, solo la URL existente
        photoUrl: existingReport.photoUrl || '',
        urgency: existingReport.urgency || 'medio',
        // Campos específicos
        lostDate: formattedLostDate,
        lastSeenLocation: existingReport.lastSeenLocation || '',
        collarInfo: existingReport.collarInfo || '',
        reward: existingReport.reward || '',
        foundDate: formattedFoundDate,
        foundExactLocation: existingReport.foundExactLocation || '',
        canRetainTemporarily: existingReport.canRetainTemporarily || false,
        injuryDetails: existingReport.injuryDetails || '',
        medicalAttentionNeeded: existingReport.medicalAttentionNeeded || false,
        temperament: existingReport.temperament || '',
        isNeutered: existingReport.isNeutered || false,
        isVaccinated: existingReport.isVaccinated || false,
        isDewormed: existingReport.isDewormed || false,
        healthStatus: existingReport.healthStatus || '',
        reasonForSeekingHome: existingReport.reasonForSeekingHome || '',
      });
      setPreviewPhoto(existingReport.photoUrl || null);
    }
  }, [existingReport]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({ ...prevData, photoFile: file }));
      setPreviewPhoto(URL.createObjectURL(file)); // Crear URL para la vista previa
    } else {
      setFormData(prevData => ({ ...prevData, photoFile: null }));
      setPreviewPhoto(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = formData.photoUrl;

      // Si hay un nuevo archivo de foto, subirlo primero
      if (formData.photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.photoFile);

        const uploadRes = await fetch('/api/uploads', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const uploadErrorData = await uploadRes.json();
          throw new Error(uploadErrorData.error || 'Error al subir la imagen.');
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url; // URL de la imagen subida (ej. de Cloudinary)
      } else if (!imageUrl && !existingReport) {
        // Si no hay foto ni es edición y no se cargó una, es error
        throw new Error('Debes subir una foto de la mascota.');
      }

      // Preparar los datos para el reporte, incluyendo la URL de la foto
      const reportData = {
        ...formData,
        photoUrl: imageUrl,
        photoFile: undefined, // Eliminar el archivo del objeto antes de enviar
        // Limpiar campos no relevantes para el tipo de reporte seleccionado
        lostDate: formData.reportType === 'perdida' ? formData.lostDate : undefined,
        lastSeenLocation: formData.reportType === 'perdida' ? formData.lastSeenLocation : undefined,
        collarInfo: formData.reportType === 'perdida' ? formData.collarInfo : undefined,
        reward: formData.reportType === 'perdida' ? parseFloat(formData.reward) || undefined : undefined,

        foundDate: formData.reportType === 'encontrada' ? formData.foundDate : undefined,
        foundExactLocation: formData.reportType === 'encontrada' ? formData.foundExactLocation : undefined,
        canRetainTemporarily: (formData.reportType === 'encontrada' || formData.reportType === 'apuros') ? formData.canRetainTemporarily : undefined,

        injuryDetails: formData.reportType === 'apuros' ? formData.injuryDetails : undefined,
        medicalAttentionNeeded: formData.reportType === 'apuros' ? formData.medicalAttentionNeeded : undefined,
        urgency: formData.reportType === 'apuros' ? formData.urgency : 'medio', // Urgencia más relevante para apuros

        temperament: formData.reportType === 'necesita_hogar' ? formData.temperament : undefined,
        isNeutered: formData.reportType === 'necesita_hogar' ? formData.isNeutered : undefined,
        isVaccinated: formData.reportType === 'necesita_hogar' ? formData.isVaccinated : undefined,
        isDewormed: formData.reportType === 'necesita_hogar' ? formData.isDewormed : undefined,
        healthStatus: formData.reportType === 'necesita_hogar' ? formData.healthStatus : undefined,
        reasonForSeekingHome: formData.reportType === 'necesita_hogar' ? formData.reasonForSeekingHome : undefined,
      };

      const url = existingReport ? `/api/reports/${existingReport._id}/update` : '/api/reports';
      const method = existingReport ? 'PUT' : 'POST'; // Usar PUT para actualizar, POST para crear

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el reporte.');
      }

      setSuccess(true);
      alert(existingReport ? 'Reporte actualizado con éxito!' : 'Reporte agregado con éxito!');
      router.push('/reports'); // Redirigir a la página de listado de reportes
      router.refresh(); // Refrescar los datos en el listado
    } catch (err) {
      console.error('Error al procesar el reporte:', err);
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{existingReport ? 'Editar Reporte de Mascota' : 'Reportar una Mascota'}</h2>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
      {success && <div className="p-3 mb-4 bg-green-100 text-green-700 border border-green-400 rounded">¡Reporte guardado con éxito!</div>}

      {/* TIPO DE REPORTE */}
      <div className="mb-4">
        <label htmlFor="reportType" className="block text-gray-700 text-sm font-bold mb-2">
          ¿Qué tipo de ayuda necesita esta mascota? <span className="text-red-500">*</span>
        </label>
        <select
          id="reportType"
          name="reportType"
          value={formData.reportType}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="perdida">Mascota Perdida</option>
          <option value="encontrada">Mascota Encontrada</option>
          <option value="apuros">Mascota en Apuros (Herida/Enferma/Peligro)</option>
          <option value="necesita_hogar">Mascota Necesita Hogar / Tránsito</option>
        </select>
      </div>

      {/* CAMPOS GENERALES */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Título del Reporte <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Perrita perdida en Recoleta"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción Detallada <span className="text-red-500">*</span></label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe a la mascota, su situación, características, comportamiento, etc."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="species" className="block text-gray-700 text-sm font-bold mb-2">Especie <span className="text-red-500">*</span></label>
        <select
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Selecciona la especie</option>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="ave">Ave</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="breed" className="block text-gray-700 text-sm font-bold mb-2">Raza (opcional)</label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          placeholder="Ej: Labrador, Siames, Mestizo"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Edad Estimada</label>
          <select
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecciona la edad</option>
            <option value="cachorro">Cachorro</option>
            <option value="joven">Joven</option>
            <option value="adulto">Adulto</option>
            <option value="mayor">Mayor</option>
            <option value="desconocida">Desconocida</option>
          </select>
        </div>
        <div className="w-1/2">
          <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Género</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecciona el género</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
            <option value="desconocido">Desconocido</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Ej: Negro, Tricolor, Atigrado"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Ubicación (Barrio, Calle Aproximada, Ciudad) <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Ej: Palermo, CABA / Cerca de Plaza Italia"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono de Contacto <span className="text-red-500">*</span></label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Ej: +54 9 11 1234-5678"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">Email de Contacto (opcional)</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Ej: tuemail@example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      {/* CAMPO DE FOTO */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Foto de la Mascota <span className="text-red-500">*</span></label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            {previewPhoto ? (
              <img src={previewPhoto} alt="Vista previa de la mascota" className="mx-auto h-48 w-48 object-cover rounded-md" />
            ) : (
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            )}
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Sube una foto</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">o arrastra y suelta</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>
      </div>

      {/* CAMPOS CONDICIONALES SEGÚN reportType */}
      {formData.reportType === 'perdida' && (
        <>
          <div className="mb-4">
            <label htmlFor="lostDate" className="block text-gray-700 text-sm font-bold mb-2">Fecha y Hora de la Pérdida <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              id="lostDate"
              name="lostDate"
              value={formData.lostDate}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastSeenLocation" className="block text-gray-700 text-sm font-bold mb-2">Último Lugar Visto <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="lastSeenLocation"
              name="lastSeenLocation"
              value={formData.lastSeenLocation}
              onChange={handleChange}
              placeholder="Ej: En la puerta del edificio 123"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="collarInfo" className="block text-gray-700 text-sm font-bold mb-2">Información del Collar/Chapa (opcional)</label>
            <input
              type="text"
              id="collarInfo"
              name="collarInfo"
              value={formData.collarInfo}
              onChange={handleChange}
              placeholder="Ej: Collar rojo con chapa de ID"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reward" className="block text-gray-700 text-sm font-bold mb-2">Recompensa (opcional)</label>
            <input
              type="number"
              id="reward"
              name="reward"
              value={formData.reward}
              onChange={handleChange}
              placeholder="Ej: 50000"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </>
      )}

      {formData.reportType === 'encontrada' && (
        <>
          <div className="mb-4">
            <label htmlFor="foundDate" className="block text-gray-700 text-sm font-bold mb-2">Fecha y Hora del Hallazgo <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              id="foundDate"
              name="foundDate"
              value={formData.foundDate}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="foundExactLocation" className="block text-gray-700 text-sm font-bold mb-2">Lugar Exacto del Hallazgo <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="foundExactLocation"
              name="foundExactLocation"
              value={formData.foundExactLocation}
              onChange={handleChange}
              placeholder="Ej: Parque Lezama, cerca de la calesita"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="canRetainTemporarily"
              name="canRetainTemporarily"
              checked={formData.canRetainTemporarily}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <label htmlFor="canRetainTemporarily" className="text-gray-700 text-sm font-bold">
              ¿Puedes retenerla temporalmente?
            </label>
          </div>
        </>
      )}

      {formData.reportType === 'apuros' && (
        <>
          <div className="mb-4">
            <label htmlFor="injuryDetails" className="block text-gray-700 text-sm font-bold mb-2">Detalles del Apuro/Lesión <span className="text-red-500">*</span></label>
            <textarea
              id="injuryDetails"
              name="injuryDetails"
              value={formData.injuryDetails}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Tiene una pata lastimada y sangra, está muy débil y no se mueve."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="medicalAttentionNeeded" className="block text-gray-700 text-sm font-bold mb-2">
              ¿Necesita atención médica urgente?
            </label>
            <div className="flex items-center">
                <input
                type="checkbox"
                id="medicalAttentionNeeded"
                name="medicalAttentionNeeded"
                checked={formData.medicalAttentionNeeded}
                onChange={handleChange}
                className="mr-2 leading-tight"
                />
                <label htmlFor="medicalAttentionNeeded" className="text-gray-700 text-sm">Sí, es una emergencia.</label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="urgency" className="block text-gray-700 text-sm font-bold mb-2">Nivel de Urgencia <span className="text-red-500">*</span></label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="bajo">Bajo (no es una emergencia inmediata)</option>
              <option value="medio">Medio (requiere atención pronto)</option>
              <option value="alto">Alto (¡Necesita ayuda AHORA!)</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="canRetainTemporarily"
              name="canRetainTemporarily"
              checked={formData.canRetainTemporarily}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <label htmlFor="canRetainTemporarily" className="text-gray-700 text-sm font-bold">
              ¿Necesitas ayuda para trasladarla/esperar asistencia?
            </label>
          </div>
        </>
      )}

      {formData.reportType === 'necesita_hogar' && (
        <>
          <div className="mb-4">
            <label htmlFor="reasonForSeekingHome" className="block text-gray-700 text-sm font-bold mb-2">Razón por la que busca hogar <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="reasonForSeekingHome"
              name="reasonForSeekingHome"
              value={formData.reasonForSeekingHome}
              onChange={handleChange}
              placeholder="Ej: Rescatada de la calle, dueños anteriores no pueden cuidarla."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="temperament" className="block text-gray-700 text-sm font-bold mb-2">Temperamento <span className="text-red-500">*</span></label>
            <textarea
              id="temperament"
              name="temperament"
              value={formData.temperament}
              onChange={handleChange}
              rows="2"
              placeholder="Ej: Juguetón con niños, tímido con extraños, se lleva bien con otros perros."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/3 flex items-center">
              <input
                type="checkbox"
                id="isNeutered"
                name="isNeutered"
                checked={formData.isNeutered}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="isNeutered" className="text-gray-700 text-sm font-bold">Castrado/a</label>
            </div>
            <div className="w-1/3 flex items-center">
              <input
                type="checkbox"
                id="isVaccinated"
                name="isVaccinated"
                checked={formData.isVaccinated}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="isVaccinated" className="text-gray-700 text-sm font-bold">Vacunado/a</label>
            </div>
            <div className="w-1/3 flex items-center">
              <input
                type="checkbox"
                id="isDewormed"
                name="isDewormed"
                checked={formData.isDewormed}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor="isDewormed" className="text-gray-700 text-sm font-bold">Desparasitado/a</label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="healthStatus" className="block text-gray-700 text-sm font-bold mb-2">Estado de Salud General (opcional)</label>
            <input
              type="text"
              id="healthStatus"
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              placeholder="Ej: Buen estado general, sin problemas de salud conocidos."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Guardando...' : (existingReport ? 'Actualizar Reporte' : 'Publicar Reporte')}
        </button>
        <button
          type="button"
          onClick={() => router.push('/reports')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}