/**
 * Basado en los schemas Address de openapi.json
 */

/**
 * Representa una dirección, tal como se lee desde la API.
 * Coincide con el schema AddressRead.
 */
export interface AddressRead {
  uuid: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_active: boolean;
}

/**
 * Representa los datos necesarios para crear una nueva dirección.
 * Coincide con el schema AddressCreate.
 */
export interface AddressCreate {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_active?: boolean;
}

/**
 * Representa los datos para actualizar una dirección existente.
 * Todos los campos son opcionales.
 * Coincide con el schema AddressUpdate.
 */
export type AddressUpdate = Partial<AddressCreate>;
