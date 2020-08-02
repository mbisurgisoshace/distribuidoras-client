import BaseService from './baseService';
import { ListaPrecio as IListaPrecio, Precio as IPrecio } from '../types';

export default class PreciosService extends BaseService {
  static preciosRoute = '/precios';
  static precioRoute = '/precios/{precio_id}';

  public static async getListasPrecio(): Promise<Array<IListaPrecio>> {
    return await this.getRequest<Array<IListaPrecio>>(this.preciosRoute);
  }

  public static async getListaPrecio(id: number): Promise<Array<IPrecio>> {
    return await this.getRequest<Array<IPrecio>>(this.buildRoute(this.precioRoute, { precio_id: id }));
  }
}
