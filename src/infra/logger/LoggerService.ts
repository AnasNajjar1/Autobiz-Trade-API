import { LogDetails } from '../../modules/usageLog/useCases/logCall/LogCallRequestDto';

export interface LogRequest {
  requestPath: string;
  // requestQueryStringParameters?: string;
  // requestBody?: string;
  // httpMethod: string;
  // country: string;
  // responseBody?: string;
  // responseStatus?: number;
  // responseTime?: number;
  userId: string;
  saleId?: string;
  details: LogDetails;
  uuid: string;
  // sourceIp: string;
}

export interface Log {
  userId: string;
  saleId?: string;
  requestPath: string;
  details?: any;
  createdAt: string;
  uuid: string;
}

export interface ILoggerService {
  log(log: LogRequest): Promise<boolean>;
}
