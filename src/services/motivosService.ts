import BaseService from './baseService';

export default class MotivosService extends BaseService {
  static motivosRoute = '/motivos';

  public static async getMotivos(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.motivosRoute);
  }
}
