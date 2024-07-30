import { CreatePointofsaleUseCase } from './CreatePointofsaleUseCase';
import { CreatePointofsaleController } from './CreatePointofsaleController';
import { pointofsaleRepo } from '../../repos';
import { dealerImporterService } from '../../../../config/services';
import { translateService } from '../../../../infra/translate';

const createPointofsaleUseCase = new CreatePointofsaleUseCase(
  pointofsaleRepo,
  dealerImporterService,
  translateService,
);

const createPointofsaleController = new CreatePointofsaleController(
  createPointofsaleUseCase,
);

export { createPointofsaleUseCase, createPointofsaleController };
