import BaseService from './baseService';

export default class ReportesService extends BaseService {
  static reportesRoute = '/reportes';

  public static async getReporteRecuperados(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.reportesRoute);
  }
}
