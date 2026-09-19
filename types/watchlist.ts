export interface Watchlist {
  id: string;
  name: string;
  isDefault?: boolean;
  symbols: string[]; // List of asset symbols contained in this list
  createdAt: string;
}
