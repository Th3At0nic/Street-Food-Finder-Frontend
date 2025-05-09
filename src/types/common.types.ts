export interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}
