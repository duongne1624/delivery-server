export interface UserAddressPayload {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  note?: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
