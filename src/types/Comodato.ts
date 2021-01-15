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
