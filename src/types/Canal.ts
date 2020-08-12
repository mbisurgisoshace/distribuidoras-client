export interface Canal {
  canal_id: number;
  canal_nombre: string;
}

export interface Subcanal {
  id: number;
  subcanal: string;
  canal_id: number;
}
