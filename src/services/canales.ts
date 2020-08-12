import BaseService from './baseService';
import { Canal as ICanal, Subcanal as ISubcanal } from '../types';

export default class CanalesService extends BaseService {
  static canalRoute = '/canales/{canal_id}';
  static canalesRoute = '/canales';
  static subcanalesRoute = '/canales/subcanales';

  public static async getCanales(): Promise<Array<ICanal>> {
    return await this.getRequest<Array<ICanal>>(this.canalesRoute);
  }

  public static async getCanal(id: number): Promise<ICanal> {
    return await this.getRequest<ICanal>(this.buildRoute(this.canalRoute, { canal_id: id }));
  }

  public static async getSubcanales(): Promise<Array<ISubcanal>> {
    return await this.getRequest<Array<ISubcanal>>(this.subcanalesRoute);
  }
}
