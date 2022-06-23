import BaseService from './baseService';

export default class ReportesService extends BaseService {
  static reportesRecuperadosRoute = '/reportes/recuperados';
  static reportesMovimientosComodatoRoute = '/reportes/comodatos_movimientos';
  static reportesPendienteFacturacionRoute = '/tango/pendiente_facturacion';

  public static async getReporteRecuperados(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.reportesRecuperadosRoute);
  }

  public static async getReporteMovimientosComodato(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.reportesMovimientosComodatoRoute);
  }

  public static async getPendienteFacturacion(desde, hasta): Promise<Array<any>> {
    return await this.postJSONRequest<any, Array<any>>(this.reportesPendienteFacturacionRoute, {desde, hasta});
  }
}
