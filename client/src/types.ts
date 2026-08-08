export type HealthcareResource = {
  id: number;
  name: string;
  category: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  description: string;
  recommendations: number;
};

export type NewHealthcareResource = {
  name: string;
  category: string;
  country: string;
  region: string;
  lat: number | string;
  lon: number | string;
  description: string;
};

export type ApiError = {
  error: string;
  details?: string[];
};

export type User = {
  id: number;
  username: string;
  isAdmin: number;
};

export type AuthResponse = {
  message?: string;
  user: User;
};