export interface Zona {
  zona_id?: number;
  zona_nombre: string;
  limites?: string;
  color?: string;
}

export interface ZonaInput {
  zona_nombre: string;
  limites?: string;
  color?: string;
}

export interface Subzona {
  sub_zona_id?: number;
  sub_zona_nombre: string;
  zona_id: number;
}
