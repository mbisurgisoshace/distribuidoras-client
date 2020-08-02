import BaseService from './baseService';
import { Zona as IZona, ZonaInput as IZonaInput } from '../types';

export default class ZonasService extends BaseService {
	static zonaRoute = '/zonas/{zona_id}';
	static zonasRoute = '/zonas';

	public static async getZonas(): Promise<Array<IZona>> {
		return await this.getRequest<Array<IZona>>(this.zonasRoute);
	}

	public static async getZona(id: number): Promise<IZona> {
		return await this.getRequest<IZona>(this.buildRoute(this.zonaRoute, { zona_id: id }));
	}

	public static async createZona(zona: IZonaInput): Promise<IZona> {
		return await this.postJSONRequest<IZonaInput, IZona>(this.zonasRoute, zona);
	}

	public static async updateZona(zona: IZonaInput, zona_id: number | string): Promise<IZona> {
		let route = this.buildRoute(this.zonaRoute, { zona_id });
		return await this.putJSONRequest<IZonaInput, IZona>(route, zona);
	}

	public static async removeZona(id: number | string): Promise<IZona> {
		return await this.deleteRequest<IZona>(this.buildRoute(this.zonaRoute, { zona_id: id }));
	}
}
