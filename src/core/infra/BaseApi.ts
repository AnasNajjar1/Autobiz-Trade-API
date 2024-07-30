import axios, { AxiosInstance } from 'axios';

export abstract class BaseApi {
  protected baseUrl: string;
  protected bearerToken: string;
  protected responseType: string;
  protected headersAccept: string;
  private axiosInstance: AxiosInstance | any = null;
  protected contentType: string;

  constructor(baseUrl: string, bearerToken?: string) {
    this.baseUrl = baseUrl;
    this.bearerToken = bearerToken;
    this.responseType = 'json';
    this.headersAccept = 'application/json';
    this.axiosInstance = axios.create({});
    this.contentType = 'application/json';
  }

  public setResponseType(responseType: string) {
    this.responseType = responseType;
  }

  public setHeadersAccept(headersAccept: string) {
    this.headersAccept = headersAccept;
  }

  protected async get(url: string, params?: any): Promise<any> {
    try {
      return await this.axiosInstance({
        method: 'GET',
        url: `${this.baseUrl}${url}`,
        params: params ? params : null,
        responseType: this.responseType,
        headers: {
          Accept: this.headersAccept,
          Authorization: this.bearerToken ? `Bearer ${this.bearerToken}` : '',
        },
      });
    } catch (error) {
      return Promise.reject({ ...error.response.data });
    }
  }

  protected async getBase64Format(url: string): Promise<any> {
    try {
      return await this.axiosInstance({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
      });
    } catch (error) {
      return Promise.reject({ ...error.response.data });
    }
  }

  protected async post(
    url: string,
    dataBody: object = {},
    headers?: object,
  ): Promise<any> {
    try {
      return await this.axiosInstance({
        method: 'POST',
        url: `${this.baseUrl}${url}`,
        headers: {
          'Content-Type': this.contentType,
          ...headers,
        },
        data: dataBody,
        json: true,
      });
    } catch (error) {
      return Promise.reject({ ...error.response.data });
    }
  }
}
