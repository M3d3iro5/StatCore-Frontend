import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:8000";
    const timeout = parseInt(
      process.env.NEXT_PUBLIC_API_TIMEOUT || "30000",
      10,
    );

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Desabilitar verificação SSL para desenvolvimento (REMOVER EM PRODUÇÃO)
      httpsAgent: {
        rejectUnauthorized: false,
      },
    });

    // Interceptor para requisições
    this.client.interceptors.request.use((config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    // Interceptor para resposta
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Resposta: ${response.status}`, response.data);
        return response;
      },
      (error) => {
        console.error(`[API] Erro:`, error.message);
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new APIClient();
