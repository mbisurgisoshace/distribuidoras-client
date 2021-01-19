export interface Comodato {
  comodato_enc_id?: number;
  fecha: string;
  cliente_id: number;
  fecha_vencimiento: string;
  fecha_renovacion: string;
  nro_comprobante: string;
  vigente: boolean;
  renovado: boolean;
  nro_renovacion?: string;
  observaciones?: string;
  chofer_id?: number;
  monto: number;
  items?: Array<ComodatoItem>
}

export interface ComodatoItem {
  comodato_det_id?: number;
  comodato_enc_id?: number;
  envase_id?: number;
  cantidad?: number;
  monto?: number;
}

export interface UltimoComodatoView {
  fecha: string;
  comprobante: string;
  items: [{
    envase_codigo: string;
    envase_nombre: string;
    cantidad: number;
    monto: number;
  }]
}
