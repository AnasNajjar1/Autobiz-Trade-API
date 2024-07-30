import { GetGroupByIdUseCase } from './GetGroupByIdUseCase';
import { GetGroupByIdController } from './GetGroupByIdController';
import { groupRepo } from '../../repos';

const getGroupByIdUseCase = new GetGroupByIdUseCase(groupRepo);

const getGroupByIdController = new GetGroupByIdController(getGroupByIdUseCase);

export { getGroupByIdUseCase, getGroupByIdController };
