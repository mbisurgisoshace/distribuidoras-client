import BaseService from './baseService';

export default class ReportesService extends BaseService {
  static reportesRecuperadosRoute = '/reportes/recuperados';
  static reportesMovimientosComodatoRoute = '/reportes/comodatos_movimientos';

  public static async getReporteRecuperados(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.reportesRecuperadosRoute);
  }

  public static async getReporteMovimientosComodato(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.reportesMovimientosComodatoRoute);
  }
}
