import BaseService from './baseService';
import { User as IUser } from '../types';

export interface AuthResponse {
	status: string;
	user?: IUser;
	token?: string;
	error: string;
}

interface AuthParams {
	username: string;
	password: string;
}

export default class AuthService extends BaseService {
	static loginRoute = '/auth/login';
	static userMeRoute = '';

	public static async getUserInfo() {
		try {
			const result = await this.getRequest<IUser>(this.userMeRoute);

			return result;
		} catch (err) {
			console.error(err);
		}

		return {};
	}

	private static createAuthParams(username: string, password: string): AuthParams {
		return {
			username: username.trim(),
			password: password.trim()
		};
	}

	private static storeAuthToken(token: string): void {
		localStorage.setItem(this.JWT_SECRET, token);
	}

	private static storeUsername(username: string): void {
		localStorage.setItem(this.USERNAME, username);
	}

	public static async login(username: string, password: string): Promise<AuthResponse> {
		try {
			const loginResponse = await this.postFormRequest<AuthResponse>(
				this.loginRoute,
				this.createAuthParams(username, password)
			);

			if (loginResponse.status === 'success') {
				this.storeUsername(username);
				this.storeAuthToken(loginResponse.token);
			}

			return loginResponse;
		} catch (e) {
			console.error(e);

			return {
				status: 'error',
				error: 'Ha ocurrido un error al intentar loguearse.'
			};
		}
	}

	public static logout(): boolean {
		localStorage.clear();
		return true;
	}

	public static isAuthed(): boolean {
		const jwt = localStorage.getItem(this.JWT_SECRET);

		return Boolean(jwt);
	}
}
