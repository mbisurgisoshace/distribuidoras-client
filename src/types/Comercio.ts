export interface Comercio {
  id?: number;
  razon_social?: string;
  telefono?: string;
  calle?: string;
  altura?: string;
  entre?: string;
  y?: string;
  piso?: string;
  depto?: string;
  localidad?: string;
  codigo_postal?: string;
  latitud?: number;
  longitud?: number;
  email?: string;
  observaciones?: string;
  zona_sub_id?: number;
  condicion_iva_id?: number;
  cuit?: string;
  estado?: number;
  stock?: Array<any>;
}

export interface Pedido {
  id?: number;
  fecha: string;
  comercio_id: number;
  movimiento_enc_id: number;
  pagado: boolean;
  entregado: boolean;
}
