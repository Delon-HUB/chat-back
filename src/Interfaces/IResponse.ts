export interface IResponse {
  success: boolean;
  data: unknown;
}

export interface IError {
  message: string;
  timestamp: number;
}

export interface IErrorResponse extends IResponse {
  data: IError;
}
