import BaseService from './baseService';

export default class TiposMovimientoService extends BaseService {
  static tiposMovimientoRoute = '/tiposMovimiento';

  public static async getTiposMovimiento(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.tiposMovimientoRoute);
  }
}
