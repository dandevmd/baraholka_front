export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string; // 679px × 829px
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}

export interface CartItem extends Product {
  qty: number;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
  alive?: boolean;
}

export interface Order {
  _id: string;
  orderItems: [
    {
      name: string;
      slug: string;
      category: string;
      image: string;
      price: number;
      countInStock: number;
      brand: string;
      product: string;
      _id: string;
    }
  ];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
