import { ServerlessRequestMap } from './serverless/ServerlessRequestMap';

export interface SearchQuery {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: any;
}

export interface HttpRequestDto {
  user?: string;
  body?: any;
  path?: any;
  queryString?: {
    language?: string;
    filter?: string;
    sortLabel?: string; //for app only
  };
  method: string;
  q?: SearchQuery;
  headers?: any;
}

export class HttpRequest {
  public static map(req: any): HttpRequestDto {
    return ServerlessRequestMap.toDto(req);
  }
}
