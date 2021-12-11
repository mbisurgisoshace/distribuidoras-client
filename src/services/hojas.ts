import BaseService from './baseService';
import { Hoja as IHoja, Movimiento } from '../types';

export default class HojasService extends BaseService {
  static hojasRoute = '/hojas';
  static hojaRoute = '/hojas/{hoja_id}';
  static hojasByFechaRoute = '/hojas/fecha/{fecha}';
  static hojaMovimientosRoute = '/hojas/{hoja_id}/movimientos';

  public static async getHojas(): Promise<Array<IHoja>> {
    return await this.getRequest<Array<IHoja>>(this.hojasRoute);
  }

  public static async getHoja(id: number): Promise<IHoja> {
    return await this.getRequest<IHoja>(this.buildRoute(this.hojaRoute, { hoja_id: id }));
  }

  public static async getHojasByFecha(fecha: string): Promise<Array<IHoja>> {
    return await this.getRequest<Array<IHoja>>(this.buildRoute(this.hojasByFechaRoute, { fecha: fecha }));
  }

  public static async createHoja(hoja: IHoja): Promise<IHoja> {
    return await this.postJSONRequest<IHoja, IHoja>(this.hojasRoute, hoja);
  }

  public static async updateHoja(hoja_id: number, hoja: IHoja): Promise<IHoja> {
    return await this.putJSONRequest<IHoja, IHoja>(this.buildRoute(this.hojaRoute, { hoja_id }), hoja);
  }

  public static async createMovimientosHoja(hoja_id: number, movimientos: Array<Movimiento>): Promise<Array<Movimiento>> {
    return await this.postJSONRequest<Array<Movimiento>, Array<Movimiento>>(this.buildRoute(this.hojaMovimientosRoute, {hoja_id}), movimientos);
  }
}
