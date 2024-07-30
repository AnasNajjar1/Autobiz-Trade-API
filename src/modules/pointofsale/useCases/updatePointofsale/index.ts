import { UpdatePointofsaleUseCase } from './UpdatePointofsaleUseCase';
import { UpdatePointofsaleController } from './UpdatePointofsaleController';
import { pointofsaleRepo } from '../../repos';
import { translateService } from '../../../../infra/translate';
const updatePointofsaleUseCase = new UpdatePointofsaleUseCase(
  pointofsaleRepo,
  translateService,
);

const updatePointofsaleController = new UpdatePointofsaleController(
  updatePointofsaleUseCase,
);

export { updatePointofsaleUseCase, updatePointofsaleController };
