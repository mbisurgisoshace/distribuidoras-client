import BaseService from './baseService';
import { Carga as ICarga } from '../types';

export default class CargasService extends BaseService {
  static cargasRoute = '/cargas';
  static cargasByHojaRoute = '/cargas/{hoja_id}';

  public static async getCargas(): Promise<Array<ICarga>> {
    return await this.getRequest<Array<ICarga>>(this.cargasRoute);
  }

  public static async getCargasByHoja(hoja_id: number): Promise<Array<ICarga>> {
    return await this.getRequest<Array<ICarga>>(this.buildRoute(this.cargasByHojaRoute, { hoja_id }));
  }
}
