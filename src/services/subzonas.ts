import BaseService from './baseService';
import { Subzona as ISubzona } from '../types';

export default class SubzonasService extends BaseService {
  static subzonaRoute = '/subzonas/{subzona_id}';
  static subzonasRoute = '/subzonas';

  public static async getSubzonas(): Promise<Array<ISubzona>> {
    return await this.getRequest<Array<ISubzona>>(this.subzonasRoute);
  }

  public static async getSubzona(id: number): Promise<ISubzona> {
    return await this.getRequest<ISubzona>(this.buildRoute(this.subzonaRoute, { subzona_id: id }));
  }
}
