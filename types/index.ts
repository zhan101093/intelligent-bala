export type Category = "book" | "game" | "poster";

export interface Product {
  id: number;
  nameKz: string;
  nameRu: string;
  descKz: string;
  descRu: string;
  price: number;
  age: string;
  cat: Category;
  hit: boolean;
  emoji: string;
  images: string[];
  rating: number;
  isNew: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export type SortOption = "default" | "price-asc" | "price-desc" | "rating";

export interface Filters {
  category: Category | "all";
  search: string;
  priceMin: number;
  priceMax: number;
  minRating: number;
  onlyNew: boolean;
  sort: SortOption;
}

export interface OrderItem {
  productId: number;
  nameKz: string;
  qty: number;
  price: number;
}

export interface Order {
  id: number;
  createdAt: string;
  name: string;
  phone: string;
  city: string | null;
  zip: string | null;
  note: string | null;
  total: number;
  items: OrderItem[];
}

export interface ProductStat {
  productId: number;
  nameKz: string;
  totalQty: number;
}

export interface RevenueSummary {
  weeklyOrderCount: number;
  weeklyTotal: number;
  monthlyOrderCount: number;
  monthlyTotal: number;
}
