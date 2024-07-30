export interface LogCallRequestDto {
  userId: string;
  saleId?: string;
  requestPath: string;
  details?: LogDetails;
  createdAt: string;
  uuid: string;
}

export interface LogDetails {
  origin: string;
  userAgent: string;
  isMobileViewer: string;
  pathParameters?: any;
  body?: any;
  path: string;
  httpMethod: string;
  viewerCountry: string;
  sourceIp: string;
}
