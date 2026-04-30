import { CreatedGuestOrderDto, GuestOrderExportDto, OrderItem } from './models/order.type';

export function jsonExport(data: any, name: string | null = null) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date();
  const dateString = date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate();
  if (name) {
    a.download = dateString + '_' + name + '.json';
  } else {
    a.download = dateString + '.json';
  }

  a.click();
  window.URL.revokeObjectURL(url);
}

export function mapToGuestOrderExport(dto: CreatedGuestOrderDto): GuestOrderExportDto {
  return {
    orderId: dto.id,
    accessToken: dto.accessToken,
    createdAt: dto.createdDate,
    status: dto.status,
    totalPrice: dto.totalPrice,

    shippingAddress: {
      street: dto.address.street,
      houseNumber: dto.address.houseNumber,
      zipCode: dto.address.zipCode,
      city: dto.address.city,
      country: dto.address.country,
    },

    items: dto.items.map((item: OrderItem) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
    })),
  };
}
