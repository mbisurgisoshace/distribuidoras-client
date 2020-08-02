import BaseService from './baseService';
import { Movimiento as IMovimiento, MovimientoItem as IMovimientoItem } from '../types';

export default class MovimientosService extends BaseService {
  static movimientosRoute = '/movimientos';
  static movimentosByHojaRoute = '/movimientos/{hoja_id}';
  static movimientoItemsRoute = '/movimientos/{movimiento_enc_id}';

  public static async getMovimientos(): Promise<Array<IMovimiento>> {
    return await this.getRequest<Array<IMovimiento>>(this.movimientosRoute);
  }

  public static async getMovimientosByHoja(hoja_id: number): Promise<Array<IMovimiento>> {
    return await this.getRequest<Array<IMovimiento>>(this.buildRoute(this.movimentosByHojaRoute, { hoja_id }));
  }

  public static async createPedido(pedido: IMovimiento): Promise<IMovimiento> {
    return await this.postJSONRequest<IMovimiento, IMovimiento>(this.movimientosRoute, pedido);
  }

  public static async createMovimientoItems(movimientoEncId: number, items: Array<IMovimientoItem>): Promise<Array<IMovimientoItem>> {
    const route = this.buildRoute(this.movimientoItemsRoute, {movimiento_enc_id: movimientoEncId});
    return await this.postJSONRequest<Array<IMovimientoItem>, Array<IMovimientoItem>>(route, items);
  }
}
