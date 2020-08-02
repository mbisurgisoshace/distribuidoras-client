import BaseService from './baseService';
import { CondicionIva as ICondicionIva } from '../types';

export default class CondicionesIvaService extends BaseService {
  static condicionIvaRoute = '/condicionesIva/{condicion_iva_id}';
  static condicionesIvaRoute = '/condicionesIva';

  public static async getCondicionesIva(): Promise<Array<ICondicionIva>> {
    return await this.getRequest<Array<ICondicionIva>>(this.condicionesIvaRoute);
  }

  public static async getCondicionIva(id: number): Promise<ICondicionIva> {
    return await this.getRequest<ICondicionIva>(this.buildRoute(this.condicionIvaRoute, { condicion_iva_id: id }));
  }
}
