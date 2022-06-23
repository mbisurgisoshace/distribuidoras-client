import BaseService from './baseService';

export default class RemitosService extends BaseService {
  static remitosRoute = '/remitos';
  static itemsRemitoRoute = '/remitos/items'

  public static async getItems(movimientosIds): Promise<any> {
    return await this.postJSONRequest(this.itemsRemitoRoute, movimientosIds);
  }

  public static async createRemitos(remitos): Promise<any> {
    return await this.postJSONRequest(this.remitosRoute, remitos);
  }
}
