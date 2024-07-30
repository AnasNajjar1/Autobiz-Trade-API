import { GetPointofsalesUseCase } from './GetPointofsalesUseCase';
import { GetPointofsalesController } from './GetPointofsalesController';
import { pointofsaleRepo } from '../../repos';
import { loggerService } from '../../../../infra/logger';

const getPointofsalesUseCase = new GetPointofsalesUseCase(pointofsaleRepo);

const getPointofsalesController = new GetPointofsalesController(
  loggerService,
  getPointofsalesUseCase,
);

export { getPointofsalesUseCase, getPointofsalesController };
