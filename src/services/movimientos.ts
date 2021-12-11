import BaseService from './baseService';
import { Movimiento as IMovimiento, MovimientoItem as IMovimientoItem } from '../types';

export default class MovimientosService extends BaseService {
  static movimientosRoute = '/movimientos';
  static movimientosSearchRoute = '/movimientos/search';
  static movimentosByHojaRoute = '/movimientos/{hoja_id}';
  static movimientoItemsRoute = '/movimientos/{movimiento_enc_id}';
  static movimientoRoute = '/movimientos/movimiento/{movimiento_enc_id}';
  static movimientosActualizacionMasivaRoute = '/movimientos/actualizacion_masiva';

  public static async getMovimientos(): Promise<Array<IMovimiento>> {
    return await this.getRequest<Array<IMovimiento>>(this.movimientosRoute);
  }

  public static async getMovimientosById(movimiento_enc_id: number): Promise<IMovimiento> {
    return await this.getRequest<IMovimiento>(this.buildRoute(this.movimientoRoute, { movimiento_enc_id }));
  }

  public static async searchMovimientos(filters): Promise<Array<any>> {
    return await this.postJSONRequest<any, any>(this.movimientosSearchRoute, filters);
  }

  public static async getMovimientosByHoja(hoja_id: number): Promise<Array<IMovimiento>> {
    return await this.getRequest<Array<IMovimiento>>(this.buildRoute(this.movimentosByHojaRoute, { hoja_id }));
  }

  public static async createPedido(pedido: IMovimiento): Promise<IMovimiento> {
    return await this.postJSONRequest<IMovimiento, IMovimiento>(this.movimientosRoute, pedido);
  }

  public static async updatePedido(pedido: IMovimiento, movimiento_enc_id: number): Promise<IMovimiento> {
    return await this.putJSONRequest<IMovimiento, IMovimiento>(this.buildRoute(this.movimientoRoute, { movimiento_enc_id }), pedido);
  }

  public static async createMovimientoItems(movimientoEncId: number, items: Array<IMovimientoItem>): Promise<Array<IMovimientoItem>> {
    const route = this.buildRoute(this.movimientoItemsRoute, {movimiento_enc_id: movimientoEncId});
    return await this.postJSONRequest<Array<IMovimientoItem>, Array<IMovimientoItem>>(route, items);
  }

  public static async updateMovimientoItems(movimientoEncId: number, items: Array<IMovimientoItem>): Promise<Array<IMovimientoItem>> {
    const route = this.buildRoute(this.movimientoItemsRoute, {movimiento_enc_id: movimientoEncId});
    return await this.putJSONRequest<Array<IMovimientoItem>, Array<IMovimientoItem>>(route, items);
  }

  public static async updateMovimientosMasivo(actualizacion) {
    return await this.putJSONRequest(this.movimientosActualizacionMasivaRoute, actualizacion);
  }
}
