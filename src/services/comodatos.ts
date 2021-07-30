import BaseService from './baseService';
import { Comodato as IComodato, ComodatoItem as IComodatoItem } from '../types';

export default class ComodatosService extends BaseService {
  static comodatosRoute = '/comodatos';
  static comodatosVigenteRoute = '/comodatos/vigentes';
  static comodatoItemsRoute = '/comodatos/{comodato_enc_id}';
  static comodatoClienteRoute = '/comodatos/cliente/{cliente_id}';
  static comodatoRenovarRoute = '/comodatos/{comodato_enc_id}/renovar';
  static comodatosRenovarRoute = '/comodatos/renovar';
  static comodatoGestionRoute = '/comodatos/gestion';

  public static async getComodatos(): Promise<Array<IComodato>> {
    return await this.getRequest<Array<IComodato>>(this.comodatosRoute);
  }

  public static async getComodatosVigente(): Promise<Array<any>> {
    return await this.getRequest<Array<any>>(this.comodatosVigenteRoute);
  }

  public static async getComodatoVigenteByCliente(clienteId: number): Promise<Array<IComodato>> {
    const route = this.buildRoute(this.comodatoClienteRoute, {cliente_id: clienteId});
    return await this.getRequest<Array<IComodato>>(route);
  }

  public static async createComodato(comodato: IComodato): Promise<IComodato> {
    return await this.postJSONRequest<IComodato, IComodato>(this.comodatosRoute, comodato);
  }

  public static async createComodatoItems(comodatoEncId: number, items: Array<IComodatoItem>): Promise<Array<IComodatoItem>> {
    const route = this.buildRoute(this.comodatoItemsRoute, {comodato_enc_id: comodatoEncId});
    return await this.postJSONRequest<Array<IComodatoItem>, Array<IComodatoItem>>(route, items);
  }

  public static async renovarComodato(comodatoEncId: number, comodato: IComodato): Promise<any> {
    const route = this.buildRoute(this.comodatoRenovarRoute, {comodato_enc_id: comodatoEncId});
    return await this.postJSONRequest<any, any>(route, comodato);
  }

  public static async gestionarComodato(gestion: Array<any>): Promise<any> {
    return await this.postJSONRequest<Array<any>, any>(this.comodatoGestionRoute, gestion);
  }

  public static async renovarComodatos(comodatos: Array<IComodato>): Promise<Array<any>> {
    return await this.putJSONRequest<Array<IComodato>, Array<any>>(this.comodatosRenovarRoute, comodatos);
  }
}
