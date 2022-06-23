export interface Movimiento {
  movimiento_enc_id?: number;
  fecha: string;
  cliente_id: number;
  hoja_ruta_id?: number;
  condicion_venta_id: number;
  tipo_movimiento_id: number;
  estado_movimiento_id: number;
  motivo_id?: number;
  visito?: boolean;
  vendio?: boolean;
  observaciones?: string;
  items?: Array<MovimientoItem>
}

export interface MovimientoItem {
  movimiento_det_id?: number;
  movimiento_enc_id?: number;
  envase_id?: number;
  cantidad?: number;
  monto?: number;
}

export interface UltimoPedidoView {
  pedido_id: number;
  items: [{
    envase_id: number;
    envase_codigo: string;
    envase_nombre: string;
    cantidad: number;
    precio: number;
    monto: number;
  }]
}
