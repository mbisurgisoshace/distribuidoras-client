export default abstract class BaseService {
  static BASE_URL = process.env.BASE_SERVICE_URL;
  static JWT_SECRET = '__JWT_SECRET__';
  static USERNAME = '__USERNAME__';
  static route: string;
  static ROUTE_REGEXP = /\{(\w+)\}/g;
  static requestCache: Map<string, any>;
  static subscriptions: Map<string, Array<Function>>;

  static ERROR_RESPONSE_CODES = [400, 401, 404, 500];

  static buildRoute(route: string, params: { [key: string]: string | number }): string {
    const routeWithParams = route.replace(this.ROUTE_REGEXP, param => {
      const paramKey = param.substring(1, param.length - 1);

      if (!params.hasOwnProperty(paramKey)) {
        throw new Error(`Params must include a key of ${param}`);
      }

      return String(params[paramKey]);
    });

    return routeWithParams;
  }

  static buildQueryRoute(route: string, params: { [key: string]: string | number }): string {
    const query = Object.entries(params).reduce((acc, param) => {
      const [key, value] = param;
      acc += `${key}=${value}&`;

      return acc;
    }, '');

    return `${route}?${query}`;
  }

  static serviceUrl(route: string = ''): string {
    return `${this.BASE_URL}${route}`;
  }

  static getJWT(): string | null {
    return localStorage.getItem(this.JWT_SECRET);
  }

  static authHeader(): { [key: string]: string } {
    return {
      Authorization: `Bearer: ${this.getJWT()}`
    };
  }

  static async getRequest<T>(route: string): Promise<T> {
    const response = await fetch(this.serviceUrl(route), {
      headers: {
        ...this.authHeader()
      }
    });

    const parsedResponse = await response.json();

    if (this.ERROR_RESPONSE_CODES.indexOf(response.status) > -1) {
      if (parsedResponse.redirect && parsedResponse.redirect == 'login') {
        localStorage.removeItem(this.JWT_SECRET);
        window.history.pushState(null, null, '/login');
      }
      throw parsedResponse;
    }

    return parsedResponse;
  }

  static async postJSONRequest<I, O>(route: string, params: I): Promise<O> {
    const body = JSON.stringify(params);

    const response = await fetch(this.serviceUrl(route), {
      method: 'POST',
      headers: {
        ...this.authHeader(),
        'Content-Type': 'application/json'
      },
      body
    });

    return await response.json();
  }

  static async postFileRequest<O>(route: string, params: FormData): Promise<O> {
    const body = params;

    const response = await fetch(this.serviceUrl(route), {
      method: 'POST',
      headers: {
        ...this.authHeader()
      },
      body
    });

    return await response.json();
  }

  static async postFormRequest<T>(route: string, params: { [key: string]: any }): Promise<T> {
    const body = Object.keys(params).reduce((bodyParams, key) => {
      bodyParams.append(key, params[key]);

      return bodyParams;
    }, new URLSearchParams());

    try {
      const response = await fetch(this.serviceUrl(route), {
        headers: {
          ...this.authHeader()
        },
        method: 'POST',
        body
      });

      return response.json();
    } catch (e) {
      console.error(e);

      throw e;
    }
  }

  static async putJSONRequest<I, O>(route: string, params?: I): Promise<O> {
    const body = JSON.stringify(params);

    const response = await fetch(this.serviceUrl(route), {
      method: 'PUT',
      headers: {
        ...this.authHeader(),
        'Content-Type': 'application/json'
      },
      body
    });

    return await response.json();
  }

  static async deleteJSONRequest<I, O>(route: string, params?: I): Promise<O> {
    const body = JSON.stringify(params);

    const response = await fetch(this.serviceUrl(route), {
      method: 'DELETE',
      headers: {
        ...this.authHeader(),
        'Content-Type': 'application/json'
      },
      body
    });

    return await response.json();
  }

  static async deleteRequest<T>(route: string): Promise<T> {
    const response = await fetch(this.serviceUrl(route), {
      method: 'DELETE',
      headers: {
        ...this.authHeader()
      }
    });

    return await response.json();
  }
}
