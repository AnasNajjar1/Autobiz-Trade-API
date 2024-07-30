import { GetPointofsaleByUuidUseCase } from './GetPointofsalealeByUuidUseCase';
import { GetPointofsaleByUuidController } from './GetPointofsaleByUuidController';
import { pointofsaleRepo } from '../../repos';
import { loggerService } from '../../../../infra/logger';

const getPointofsaleByUuidUseCase = new GetPointofsaleByUuidUseCase(
  pointofsaleRepo,
);

const getPointofsaleByUuidController = new GetPointofsaleByUuidController(
  loggerService,
  getPointofsaleByUuidUseCase,
);

const getPointofsaleByUuidHandler = (event) => {
  return getPointofsaleByUuidController.execute(event);
};

export {
  getPointofsaleByUuidUseCase,
  getPointofsaleByUuidController,
  getPointofsaleByUuidHandler,
};
