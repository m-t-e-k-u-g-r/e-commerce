export function isAddressDto(data: unknown) {
  const candidate: any = Array.isArray(data) ? data[0] : data;

  if (!candidate || typeof candidate !== 'object') {
    return {
      object: candidate,
      isAddressDto: false
    };
  }

  const obj = candidate as Record<string, unknown>;

  return {
    object: obj,
    isAddressDto: (
      typeof obj['id'] === 'number' &&
      typeof obj['type'] === 'string' &&
      typeof obj['salutation'] === 'string' &&
      typeof obj['forename'] === 'string' &&
      typeof obj['surname'] === 'string' &&
      typeof obj['street'] === 'string' &&
      typeof obj['houseNumber'] === 'string' &&
      typeof obj['zipCode'] === 'string' &&
      typeof obj['city'] === 'string' &&
      typeof obj['country'] === 'string'
    )
  };
}
