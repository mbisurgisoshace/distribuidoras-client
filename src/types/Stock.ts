export type Modulo = 'Venta' | 'Stock';
export type TipoMovimiento = 'Venta Diaria' | 'Compra Producto' | 'Devolucion Averia' | 'Reposicion Averia' | 'Donaciones' | 'Compra Envase' | 'Venta Envase' | 'Saldo Inicial';

export interface ColumnaStock {
  id?: number;
  label: string;
  articulos: string;
  stock: number;
}

export interface MovimientoStock {
  movimiento_stock_enc_id?: number;
  hoja_ruta_id?: number;
  fecha: string;
  tipo_movimiento: TipoMovimiento;
  modulo: Modulo;
  nro_comprobante?: string;
}

export interface MovimientoStockItem {
  movimiento_stock_det_id?: number;
  movimiento_stock_enc_id?: number;
  envase_id: number;
  estado_envase_id: number;
  cantidad: number;
  comodato_generado: boolean;
  costo?: number;
}
