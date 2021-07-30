import BaseService from './baseService';

export default class EstadosMovimientoService extends BaseService {
  static estadosMovimientoRoute = '/estadosMovimiento';

  public static async getEstadosMovimiento(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.estadosMovimientoRoute);
  }
}
