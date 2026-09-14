import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpProvider {
  private readonly httpClient: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.httpClient = client;
  }

  /**
   * Реализация отправки `POST` запроса
   * @param {string} url - эндпоинт
   * @param {object} body - тело запроса
   * @param {AxiosResponse} config - дополнительные параметры конфигруации запроса
   */
  public async post<T = unknown, U = unknown>(
    url: string,
    body?: T,
    config?: AxiosRequestConfig,
  ): Promise<U> {
    const result = await this.httpClient.post<T, AxiosResponse<U>>(
      url,
      body,
      config,
    );

    return result.data;
  }
}
