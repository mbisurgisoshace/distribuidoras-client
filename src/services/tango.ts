import BaseService from './baseService';

export default class TangoService extends BaseService {
  static syncClientesRoute = '/tango/clientes';
  static syncRemitosRoute = '/tango/remitos';

  public static async syncClientes(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.syncClientesRoute);
  }

  public static async syncRemitos(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.syncRemitosRoute);
  }
}
