export interface Restaurant {
  _id?: string;
  name: string;
  description?: string;
  address: string;
  owner_id: string;
  phone?: string;
  is_open: boolean;
  open_time?: string;
  close_time?: string;
  location?: {
    lat: number;
    lng: number;
  };
  created_at: Date;
}
