import BaseService from './baseService';
import { Envase as IEnvase } from '../types';

export default class EnvasesService extends BaseService {
  static envasesRoute = '/envases';

  public static async getEnvases(): Promise<Array<IEnvase>> {
    return await this.getRequest<Array<IEnvase>>(this.envasesRoute);
  }
}
