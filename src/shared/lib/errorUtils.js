/**
 * Extrae el mejor mensaje de error posible de una respuesta Axios.
 * Maneja: message, errors (validación por campo), errores de red y timeouts.
 */
export function getErrorMessage(error, fallback = 'Ha ocurrido un error inesperado') {
  if (!error) return fallback;

  if (error.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === 'object') {
      const fieldMessages = Object.values(data.errors).filter(Boolean);
      if (fieldMessages.length > 0) return fieldMessages.join('. ');
    }

    if (data.message && typeof data.message === 'string') return data.message;
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.';
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'No se pudo conectar con el servidor. Verifica que el servidor esté activo y tu conexión a internet.';
  }

  if (error.message) return error.message;

  return fallback;
}

/**
 * Extrae errores de validación por campo desde la respuesta del backend.
 * Retorna un objeto { campo: mensaje } o null si no hay errores por campo.
 */
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
    return errors;
  }
  return null;
}

/**
 * Extrae el código de error del backend (EMAIL_NOT_VERIFIED, ACCOUNT_LOCKED, etc.)
 */
export function getErrorCode(error) {
  return error?.response?.data?.code || null;
}

/**
 * Retorna el status HTTP del error
 */
export function getErrorStatus(error) {
  return error?.response?.status || null;
}
