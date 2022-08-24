import BaseService from './baseService';

export default class TablasService extends BaseService {
  static tablasRoute = '/tablas';

  public static async getTablas(tables: string = ''): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(
      this.buildQueryRoute(this.tablasRoute, { tables })
    );
  }
}
