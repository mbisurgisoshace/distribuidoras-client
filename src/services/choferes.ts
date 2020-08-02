import BaseService from './baseService';
import { Chofer as IChofer } from '../types';

export default class ChoferesService extends BaseService {
  static choferRoute = '/choferes/{chofer_id}';
  static choferesRoute = '/choferes';

  public static async getChoferes(): Promise<Array<IChofer>> {
    return await this.getRequest<Array<IChofer>>(this.choferesRoute);
  }

  public static async getChofer(id: number): Promise<IChofer> {
    return await this.getRequest<IChofer>(this.buildRoute(this.choferRoute, { chofer_id: id }));
  }
}
