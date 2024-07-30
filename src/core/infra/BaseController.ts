import { HttpRequestDto, HttpRequest } from '../../infra/http/HttpRequest';
import { APIGatewayEvent } from 'aws-lambda';

export abstract class BaseController {
  protected abstract executeImpl(req: HttpRequestDto): Promise<void | any>;

  public async execute(event: APIGatewayEvent): Promise<any> {
    const req = HttpRequest.map(event);
    try {
      return await this.executeImpl(req);
    } catch (err) {
      this.fail('An unexpected error occurred');
    }
  }

  public static jsonResponse(
    code: number,
    body?: any,
    additionalHeaders?: any,
  ) {
    const res = {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Security-Policy': "default-src 'self';",
        'X-Frame-Options': 'sameorigin',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security':
          'max-age=31536000; includeSubDomains; preload',
        ...additionalHeaders,
      },
    };

    if (body) {
      res['body'] = JSON.stringify(body);
    }

    return res;
  }

  public fail(error: Error | string) {
    return BaseController.jsonResponse(500, error.toString());
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(404, message ? message : 'no found');
  }

  public ok<T>(dto?: T, additionalHeaders?: any) {
    return BaseController.jsonResponse(200, dto, additionalHeaders);
  }

  public created<T>(dto?: T) {
    return BaseController.jsonResponse(201, dto);
  }

  public conflict<T>(dto?: T) {
    return BaseController.jsonResponse(409, dto);
  }

  public updated<T>(dto?: T) {
    return BaseController.jsonResponse(201, dto);
  }

  public paginate<T>(
    dto: T,
    pagination: { limit: number; offset: number; count: number },
    additionalHeaders?: any,
  ) {
    const paginationHeaders = {
      'Access-Control-Expose-Headers': 'Content-Range',
      'Content-Range': `paginate ${pagination.limit}-${pagination.offset}/${pagination.count}`,
    };

    return BaseController.jsonResponse(200, dto, {
      ...paginationHeaders,
      ...additionalHeaders,
    });
  }

  public deleted() {
    return BaseController.jsonResponse(204);
  }
}
