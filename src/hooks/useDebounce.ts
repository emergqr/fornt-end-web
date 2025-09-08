import { useState, useEffect } from 'react';

/**
 * Hook personalizado para "rebotar" (debounce) un valor.
 * Retrasa la actualización de un valor hasta que ha pasado un tiempo específico
 * sin que ese valor haya cambiado. Es muy útil para evitar llamadas a la API
 * en cada pulsación de tecla en un campo de búsqueda.
 *
 * @param value El valor que se quiere rebotar (ej. el texto de un input).
 * @param delay El tiempo de espera en milisegundos (ej. 500).
 * @returns El valor rebotado, que solo se actualizará una vez que el valor original
 * no haya cambiado durante el tiempo de `delay`.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para almacenar el valor rebotado
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Se crea un temporizador que actualizará el valor rebotado
    // después del tiempo de `delay` especificado.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza: se ejecuta si el valor cambia antes de que
    // el temporizador se complete. Esto cancela el temporizador anterior
    // y lo reinicia, evitando actualizaciones innecesarias.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}
