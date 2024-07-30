import { GetGroupsUseCase } from './GetGroupsUseCase';
import { GetGroupsController } from './GetGroupsController';
import { groupRepo } from '../../repos';

const getGroupsUseCase = new GetGroupsUseCase(groupRepo);

const getGroupsController = new GetGroupsController(getGroupsUseCase);

export { getGroupsUseCase, getGroupsController };
