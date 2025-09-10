import { useState, useEffect } from 'react';

/**
 * @file This file defines the `useDebounce` custom hook, which is used to delay
 * processing a rapidly changing value until the user has stopped providing input.
 */

/**
 * A custom hook to debounce a value.
 * It delays updating the returned value until a specified amount of time has passed
 * without the original value changing. This is highly useful for performance optimization,
 * such as preventing API calls on every keystroke in a search input.
 *
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce (e.g., text from an input field).
 * @param {number} delay The debounce delay in milliseconds (e.g., 500).
 * @returns {T} The debounced value, which only updates after the original `value` 
 * has not changed for the specified `delay`.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: This is executed if the `value` or `delay` changes before
    // the timer completes. It cancels the previous timer, preventing premature updates
    // and effectively restarting the debounce period.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // This effect re-runs only if the value or delay changes.

  return debouncedValue;
}
