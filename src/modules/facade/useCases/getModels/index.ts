import { GetModelsUseCase } from './GetModelsUseCase';
import { GetModelsController } from './GetModelsController';
import { modelRepo } from '../../repos';

const getModelsUseCase = new GetModelsUseCase(modelRepo);

const getModelsController = new GetModelsController(getModelsUseCase);

export { getModelsUseCase, getModelsController };
