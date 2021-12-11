import BaseService from './baseService';
import { Cliente as ICliente, UltimoPedidoView as IUltimoPedidoView, UltimoComodatoView as IUltimoComodatoView } from '../types';

export default class ClientesService extends BaseService {
  static clientesRoute = '/clientes';
  static clientesSearchRoute = '/clientes/search'
  static clienteRoute = '/clientes/{cliente_id}';
  static clientesPlantillaRoute = '/clientes/plantilla';
  static clientesCanalRoute = '/clientes/canal/{canal_id}';
  static lastClienteRoute = '/clientes/last';
  static lastPedidoClienteRoute = '/clientes/{cliente_id}/last';
  static lastComodatoClienteRoute = '/clientes/{cliente_id}/comodato';

  public static async getClientes(): Promise<Array<ICliente>> {
    return await this.getRequest<Array<ICliente>>(this.clientesRoute);
  }

  public static async getCliente(id: number): Promise<ICliente> {
    return await this.getRequest<ICliente>(this.buildRoute(this.clienteRoute, { cliente_id: id }));
  }

  public static async getClientesPlantilla(zonaId: number, diaSemana: string): Promise<Array<ICliente>> {
    return await this.getRequest<Array<ICliente>>(this.buildQueryRoute(this.clientesPlantillaRoute, {
      zonaId,
      diaSemana
    }));
  }

  public static async searchClientes(filters): Promise<Array<any>> {
    return await this.postJSONRequest<any, any>(this.clientesSearchRoute, filters);
  }

  public static async getClientesByCanal(canal_id: number): Promise<Array<ICliente>> {
    return await this.getRequest<Array<ICliente>>(this.buildRoute(this.clientesCanalRoute, { canal_id }));
  }

  public static async getLastCliente(): Promise<number> {
    return await this.getRequest<number>(this.lastClienteRoute);
  }

  public static async createCliente(cliente: ICliente): Promise<ICliente> {
    return await this.postJSONRequest<ICliente, ICliente>(this.clientesRoute, cliente);
  }

  public static async updateCliente(cliente: ICliente, cliente_id: number | string): Promise<ICliente> {
    let route = this.buildRoute(this.clienteRoute, { cliente_id });
    return await this.putJSONRequest<ICliente, ICliente>(route, cliente);
  }

  public static async getLastPedidoCliente(id: number): Promise<IUltimoPedidoView> {
    return await this.getRequest<IUltimoPedidoView>(this.buildRoute(this.lastPedidoClienteRoute, { cliente_id: id }));
  }

  public static async getLastComodatoCliente(id: number): Promise<IUltimoComodatoView> {
    return await this.getRequest<IUltimoComodatoView>(this.buildRoute(this.lastComodatoClienteRoute, { cliente_id: id }));
  }
}
