export interface Carga {
  carga_enc_id?: number;
  fecha: string;
  carga_tipo_id: number;
  hoja_ruta_id: number;
  items?: Array<CargaItem>;
}

export interface CargaItem {
  carga_det_id?: number;
  carga_enc_id: number;
  envase_id: number;
  lleno?: number;
  vacio?: number;
  averiado?: number;
  retiro?: number;
  entrega?: number;
  cambio?: number;
  blanco?: number;
  color?: number;
}
