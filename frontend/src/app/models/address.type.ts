export interface AddressDto {
  type: string;
  salutation: string;
  forename: string;
  surname: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface OrderAddressDto {
  id: number;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface GuestOrderAddressDto extends Omit<OrderAddressDto, 'id'> {}

export interface AddressForm extends AddressDto {
  id: number;
}

export interface Address extends AddressForm {
  userId: number;
}
