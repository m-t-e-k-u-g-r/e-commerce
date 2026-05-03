export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryIds: number[];
}

export interface DB_Product extends Omit<Product, 'imageUrl'> {
  imageId: string;
}
