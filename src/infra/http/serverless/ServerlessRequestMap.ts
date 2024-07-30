import { APIGatewayEvent } from 'aws-lambda';
import { HttpRequestDto } from '../HttpRequest';
import { LogRequest } from '../../logger/LoggerService';
import { UuidUniqueEntityId } from '../../uniqueIdentifier/uuidV4-uniqueIdentifier';

export class ServerlessRequestMap {
  private static parseUserId(event: APIGatewayEvent) {
    return event.requestContext?.authorizer?.principalId;
  }

  public static toDto(event: APIGatewayEvent): HttpRequestDto {
    const userId = ServerlessRequestMap.parseUserId(event);

    let offset = event.queryStringParameters?.range
      ? JSON.parse(event.queryStringParameters.range)[0]
      : null;

    offset = Number(offset);

    let limit = event.queryStringParameters?.range
      ? JSON.parse(event.queryStringParameters.range)[1] - offset + 1
      : null;

    limit = Number(limit);
    limit = limit === 0 ? 12 : limit;

    const selectedIds = event.queryStringParameters?.filter
      ? JSON.parse(event.queryStringParameters?.filter)?.id
      : null;

    return {
      user: userId,
      body: event.body ? JSON.parse(event.body) : undefined,
      queryString: event.queryStringParameters,
      path: event.pathParameters,
      method: event.httpMethod,
      q: {
        limit: selectedIds ? selectedIds.length : limit,
        offset,
        sortBy: event.queryStringParameters?.sort
          ? JSON.parse(event.queryStringParameters.sort)[0]
          : 'id',
        sortOrder: event.queryStringParameters?.sort
          ? JSON.parse(event.queryStringParameters.sort)[1]
          : 'desc',
        filter: event.queryStringParameters?.filter
          ? JSON.parse(event.queryStringParameters.filter)
          : {},
      },
      headers: Object.keys(event.headers).reduce(
        (c, k) => ((c[k.toLowerCase()] = event.headers[k]), c),
        {},
      ),
    };
  }

  public static toLogDto(event: APIGatewayEvent): LogRequest {
    return {
      requestPath: event.resource,
      userId: ServerlessRequestMap.parseUserId(event),
      saleId: event.pathParameters?.uuid,
      uuid: new UuidUniqueEntityId().generate(),
      details: {
        origin: event.headers.origin,
        userAgent: event.headers['User-Agent'],
        isMobileViewer: event.headers['CloudFront-Is-Mobile-Viewer'],
        path: event.path,
        httpMethod: event.httpMethod,
        viewerCountry: event.headers['CloudFront-Viewer-Country'],
        sourceIp: event.requestContext.identity.sourceIp,
      },
    };
  }
}
