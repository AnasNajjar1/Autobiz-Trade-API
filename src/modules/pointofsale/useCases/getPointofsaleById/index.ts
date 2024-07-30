import { GetPointofsaleByIdUseCase } from './GetPointofsaleByIdUseCase';
import { GetPointofsaleByIdController } from './GetPointofsaleByIdController';
import { pointofsaleRepo } from '../../repos';
import { loggerService } from '../../../../infra/logger';

const getPointofsaleByIdUseCase = new GetPointofsaleByIdUseCase(
  pointofsaleRepo,
);

const getPointofsaleByIdController = new GetPointofsaleByIdController(
  loggerService,
  getPointofsaleByIdUseCase,
);

export { getPointofsaleByIdUseCase, getPointofsaleByIdController };
