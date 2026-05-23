export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string[];
}

export interface LiveStream {
  id: string;
  title: string;
  chefName: string;
  viewers: number;
  thumbnail: string;
}
