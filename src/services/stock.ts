import BaseService from './baseService';
import { ColumnaStock as IColumnaStock, MovimientoStock as IMovimientoStock, MovimientoStockItem as IMovimientoStockItem } from '../types';

export default class StockService extends BaseService {
  static columnasStockRoute = '/stock/columnasStock';
  static movimientosStockRoute = '/stock/movimientos';
  static movimientoItemsStockRoute = '/stock/movimientos/{movimiento_enc_id}';

  public static async getColumnasStock(): Promise<Array<IColumnaStock>> {
    return await this.getRequest<Array<IColumnaStock>>(this.columnasStockRoute);
  }

  public static async createMovimiento(movimiento: IMovimientoStock): Promise<IMovimientoStock> {
    return await this.postJSONRequest<IMovimientoStock, IMovimientoStock>(this.movimientosStockRoute, movimiento);
  }

  public static async createMovimientoItems(movimientoEncId: number, items: Array<IMovimientoStockItem>): Promise<Array<IMovimientoStockItem>> {
    const route = this.buildRoute(this.movimientoItemsStockRoute, {movimiento_enc_id: movimientoEncId});
    return await this.postJSONRequest<Array<IMovimientoStockItem>, Array<IMovimientoStockItem>>(route, items);
  }
}
