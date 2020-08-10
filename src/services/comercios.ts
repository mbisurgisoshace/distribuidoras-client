import BaseService from './baseService';
import { Comercio as IComercio, Pedido as IPedido, StockItem as IStockItem } from '../types';

export default class ComerciosService extends BaseService {
  static comerciosRoute = '/comercios';
  static comercioRoute = '/comercios/{comercio_id}';
  static stockComerciosRoute = '/comercios/stock';
  static pedidosComerciosRoute = '/comercios/pedidos';
  static pedidosEntregarComerciosRoute = '/comercios/pedidos/entregar';

  public static async getComercios(withStock: boolean = false): Promise<Array<IComercio>> {
    let query = withStock ? '?withStock=true' : '';
    return await this.getRequest<Array<IComercio>>(this.comerciosRoute + query);
  }

  public static async getComercio(id: number): Promise<IComercio> {
    return await this.getRequest<IComercio>(this.buildRoute(this.comercioRoute, { comercio_id: id }));
  }

  public static async getPedidos(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.pedidosComerciosRoute);
  }

  public static async createComercio(comercio: IComercio): Promise<IComercio> {
    return await this.postJSONRequest<IComercio, IComercio>(this.comerciosRoute, comercio);
  }

  public static async createPedidoComercio(pedido: IPedido): Promise<IPedido> {
    return await this.postJSONRequest<IPedido, IPedido>(this.pedidosComerciosRoute, pedido);
  }

  public static async updateComercio(comercio: IComercio, comercio_id: number | string): Promise<IComercio> {
    let route = this.buildRoute(this.comercioRoute, { comercio_id });
    return await this.putJSONRequest<IComercio, IComercio>(route, comercio);
  }

  public static async entregarPedidoComercio(pedidos_id: Array<number>): Promise<any> {
    return await this.postJSONRequest<Array<number>, any>(this.pedidosEntregarComerciosRoute, pedidos_id);
  }

  public static async createStockComercio(items: Array<IStockItem>): Promise<Array<IStockItem>> {
    return await this.postJSONRequest<Array<IStockItem>, Array<IStockItem>>(this.stockComerciosRoute, items);
  }
}
