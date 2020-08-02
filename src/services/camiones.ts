import BaseService from './baseService';
import { Camion as ICamion } from '../types';

export default class CamionesService extends BaseService {
  static camionRoute = '/camiones/{camion_id}';
  static camionesRoute = '/camiones';

  public static async getCamiones(): Promise<Array<ICamion>> {
    return await this.getRequest<Array<ICamion>>(this.camionesRoute);
  }

  public static async getCamion(id: number): Promise<ICamion> {
    return await this.getRequest<ICamion>(this.buildRoute(this.camionRoute, { camion_id: id }));
  }
}
