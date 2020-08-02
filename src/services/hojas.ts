import BaseService from './baseService';
import { Hoja as IHoja } from '../types';

export default class HojasService extends BaseService {
  static hojasRoute = '/hojas';
  static hojaRoute = '/hojas/{hoja_id}';
  static hojasByFechaRoute = '/hojas/fecha/{fecha}';

  public static async getHojas(): Promise<Array<IHoja>> {
    return await this.getRequest<Array<IHoja>>(this.hojasRoute);
  }

  public static async getHoja(id: number): Promise<IHoja> {
    return await this.getRequest<IHoja>(this.buildRoute(this.hojaRoute, { hoja_id: id }));
  }

  public static async getHojasByFecha(fecha: string): Promise<Array<IHoja>> {
    return await this.getRequest<Array<IHoja>>(this.buildRoute(this.hojasByFechaRoute, { fecha: fecha }));
  }

  public static async updateHoja(hoja_id: number, hoja: IHoja): Promise<IHoja> {
    return await this.putJSONRequest<IHoja, IHoja>(this.buildRoute(this.hojaRoute, { hoja_id }), hoja);
  }
}
