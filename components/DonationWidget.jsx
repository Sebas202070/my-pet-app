// src/components/DonationWidget.jsx
'use client'; // Marca este componente como un Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirigir al usuario
import { CreditCardIcon, GiftIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Iconos

export default function DonationWidget() {
  const router = useRouter();
  const predefinedAmounts = [500, 1000, 2000, 5000]; // Montos de donación en ARS
  const [selectedAmount, setSelectedAmount] = useState(predefinedAmounts[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setCustomAmount(''); // Limpiar el monto personalizado si se selecciona uno predefinido
    setError(null);
    setSuccess(false);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Permitir solo números y un punto decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(parseFloat(value) || 0); // Actualizar selectedAmount para validación
    }
    setIsCustomAmount(true);
    setError(null);
    setSuccess(false);
  };

  const handleDonate = async () => {
    setError(null);
    setSuccess(false);

    let amountToDonate = isCustomAmount ? parseFloat(customAmount) : selectedAmount;

    // Validaciones básicas
    if (!amountToDonate || amountToDonate <= 0) {
      setError('Por favor, ingresa un monto válido para la donación.');
      return;
    }
    if (amountToDonate < 100) { // Ejemplo de monto mínimo
      setError('El monto mínimo de donación es $100.');
      return;
    }

    setIsLoading(true);
    try {
      // Llamada a tu API Route para crear la preferencia de pago en Mercado Pago
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountToDonate, description: 'Donación a Mascotas Solidarias Misiones' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar el pago con Mercado Pago.');
      }

      // Redirigir al usuario a la URL de pago de Mercado Pago
      // data.init_point es la URL de pago que devuelve Mercado Pago
      if (data.init_point) {
        setSuccess(true);
        // Puedes redirigir directamente o abrir en una nueva pestaña
        window.location.href = data.init_point;
        // router.push(data.init_point); // Esto podría ser problemático con redirecciones externas
      } else {
        setError('No se pudo obtener la URL de pago de Mercado Pago.');
      }

    } catch (err) {
      console.error('Error en la donación:', err);
      setError(err.message || 'Ocurrió un error inesperado al procesar la donación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <GiftIcon className="h-6 w-6 text-blue-600 mr-2" />
          Elige un monto para donar:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountChange(amount)}
              className={`py-3 px-2 rounded-lg text-lg font-bold transition-all duration-200
                ${selectedAmount === amount && !isCustomAmount
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ${amount.toLocaleString('es-AR')}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCardIcon className="h-6 w-6 text-blue-600 mr-2" />
          O ingresa un monto personalizado:
        </h3>
        <input
          type="text" // Usamos text para controlar el input y permitir el punto decimal
          inputMode="decimal" // Sugiere al teclado móvil mostrar un teclado numérico
          pattern="[0-9]*[.,]?[0-9]*" // Patrón para validación básica de números
          value={customAmount}
          onChange={handleCustomAmountChange}
          placeholder="Ej: 750.50"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        <p className="text-sm text-gray-500 mt-2">
          Monto actual: ${selectedAmount.toLocaleString('es-AR')}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
          <XCircleIcon className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span className="block sm:inline">¡Redirigiendo a Mercado Pago!</span>
        </div>
      )}

      <button
        onClick={handleDonate}
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-3 px-6 rounded-lg text-xl font-bold transition-colors duration-300
          ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'}`}
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="h-6 w-6 mr-3 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCardIcon className="h-6 w-6 mr-3" />
            Donar Ahora
          </>
        )}
      </button>
    </div>
  );
}