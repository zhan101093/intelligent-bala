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
