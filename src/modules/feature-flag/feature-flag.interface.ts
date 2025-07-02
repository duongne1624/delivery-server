export interface FeatureFlag {
  _id?: string;
  key: string;
  description?: string;
  is_enabled: boolean;
  updated_at: Date;
}
