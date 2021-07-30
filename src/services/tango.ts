import BaseService from './baseService';

export default class TangoService extends BaseService {
  static syncClientesRoute = '/tango/clientes';

  public static async syncClientes(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.syncClientesRoute);
  }
}
