// app/api/uploads/route.js
import { NextResponse } from 'next/server';
import cloudinary from '/lib/cloudinary'; // Asumo que '@/lib/cloudinary' sigue siendo la ruta correcta

// Función para subir una imagen individual a Cloudinary
const uploadImageToCloudinary = async (file) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // En tu ejemplo, usas `data:image/png;base64,${base64Image}`.
    // Esto funciona si la imagen es PNG. Si es otro tipo, Cloudinary lo maneja,
    // pero es más robusto usar el buffer directamente con upload_stream
    // si el cliente está enviando un archivo real, o simplemente pasar el buffer
    // y dejar que Cloudinary detecte el tipo.
    // Tu enfoque de convertir a base64 y luego subirlo es funcional para FILES.
    const base64Image = buffer.toString('base64');
    
    // Aquí es donde usamos el método `upload` con el string base64,
    // tal como lo haces en tu función `uploadImages` de ejemplo.
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64Image}`, {
      folder: 'mascotas-solidarias-reports', // Carpeta en Cloudinary para organizar los reportes
      resource_type: 'auto' // Permite a Cloudinary detectar el tipo de archivo (imagen, video, etc.)
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return null;
  }
};


export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); // Esperamos un solo archivo llamado 'file'

    if (!file) {
      return NextResponse.json({ error: 'No se encontró ningún archivo para subir.' }, { status: 400 });
    }

    // Usamos la función de ayuda para subir la imagen
    const imageUrl = await uploadImageToCloudinary(file);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Fallo al subir la imagen a Cloudinary.' }, { status: 500 });
    }

    // Devuelve la URL segura y el public_id si lo necesitas
    // (uploadImageToCloudinary solo devuelve secure_url, podrías modificarla para devolver el objeto completo de Cloudinary)
    return NextResponse.json({ url: imageUrl, message: 'Imagen subida exitosamente.' }, { status: 200 });

  } catch (error) {
    console.error('Error general en la API de subida:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la subida de la imagen', details: error.message },
      { status: 500 }
    );
  }
}