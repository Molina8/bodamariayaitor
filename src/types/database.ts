export interface Guest {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  dietary_restrictions: string | null;
  favorite_music: string | null;
  bus_service: boolean;
  bus_route: string | null;
  companions: Companion[];
}

export interface Companion {
  name: string;
  dietary_restrictions: string | null;
  favorite_music: string | null;
} 