export interface ListaPrecio {
  lista_precio_id?: number;
  lista_precio_nombre?: string;
}

export interface Precio {
  lista_precio_det_id?: number;
  lista_precio_id?: number;
  envase_id: number;
  precio: number;
}
