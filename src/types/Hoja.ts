export interface Hoja {
  hoja_ruta_id?: number;
  hoja_ruta_numero: number;
  fecha: string;
  zona_id: number;
  chofer_id: number;
  camion_id: number;
  km_inicial: number;
  km_final: number;
  venta_contado: number;
  venta_cta_cte: number;
  venta_tarjeta: number;
  gasto_combustible: number;
  gasto_viatico: number;
  gasto_otro: number;
  cobranza: number;
  cheques: number;
  efectivo: number;
  estado: boolean;
  cierre_stock: boolean;
  control_stock: boolean;
  cierre_mobile: boolean;
}
