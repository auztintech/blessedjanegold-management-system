export interface Shop {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationPayload {
  name: string;
  location: string;
  is_active: boolean;
}
