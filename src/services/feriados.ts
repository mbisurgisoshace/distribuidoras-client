import BaseService from './baseService';
import { ListaPrecio as IListaPrecio, Precio as IPrecio } from '../types';

export default class FeriadosService extends BaseService {
  static feriadosRoute = '/feriados';
  static feriadoRoute = '/feriados/{feriado_id}';

  public static async getFeriados(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.feriadosRoute);
  }

  public static async createFeriado(feriado): Promise<any> {
    return await this.postJSONRequest(this.feriadosRoute, feriado);
  }

  public static async updateFeriado(id: number, feriado): Promise<any> {
    return await this.putJSONRequest(this.buildRoute(this.feriadoRoute, { feriado_id: id }), feriado);
  }
}
