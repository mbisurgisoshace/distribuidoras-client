import BaseService from './baseService';

export default class ObjetivosService extends BaseService {
  static objetivosRoute = '/objetivos';

  public static async createObjetivos(objetivos: any[]): Promise<any[]> {
    return await this.postJSONRequest<any, any>(this.objetivosRoute, objetivos);
  }
}
