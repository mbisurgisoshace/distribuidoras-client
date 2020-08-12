export interface Cliente {
  cliente_id?: number;
  cliente_codigo?: number;
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
  observaciones?: string;
  zona_sub_id?: number;
  condicion_iva_id?: number;
  cuit?: string;
  condicion_venta_id?: number;
  canal_id?: number;
  subcanal_id?: number;
  lista_precio_id?: number;
  fecha_ultima_compra?: string;
  estado?: number;
}
