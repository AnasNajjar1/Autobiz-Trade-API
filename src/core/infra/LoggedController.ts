import { BaseController } from './BaseController';
import { ILoggerService } from '../../infra/logger/LoggerService';
import { APIGatewayEvent } from 'aws-lambda';
import { ServerlessRequestMap } from '../../infra/http/serverless/ServerlessRequestMap';

export abstract class LoggedController extends BaseController {
  private loggerService: ILoggerService;

  constructor(loggerService: ILoggerService) {
    super();
    this.loggerService = loggerService;
  }

  async execute(request: APIGatewayEvent): Promise<any> {
    try {
      // log in bloc try/catch to avoid program failure if log unavailable
      await this.loggerService.log(ServerlessRequestMap.toLogDto(request));
    } catch (e) {
      console.warn('Logger Failed !!!');
    }
    return await super.execute(request);
  }
}
