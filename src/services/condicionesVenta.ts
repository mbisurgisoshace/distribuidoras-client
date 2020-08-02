import BaseService from './baseService';
import { CondicionVenta as ICondicionVenta } from '../types';

export default class CondicionesVentaService extends BaseService {
  static condicionVentaRoute = '/condicionesVenta/{condicion_venta_id}';
  static condicionesVentaRoute = '/condicionesVenta';

  public static async getCondicionesVenta(): Promise<Array<ICondicionVenta>> {
    return await this.getRequest<Array<ICondicionVenta>>(this.condicionesVentaRoute);
  }

  public static async getCondicionVenta(id: number): Promise<ICondicionVenta> {
    return await this.getRequest<ICondicionVenta>(this.buildRoute(this.condicionVentaRoute, { condicion_venta_id: id }));
  }
}
