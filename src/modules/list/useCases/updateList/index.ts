import { UpdateListUseCase } from './UpdateListUseCase';
import { UpdateListController } from './UpdateListController';
import { listRepo } from '../../repos';

const updateListUseCase = new UpdateListUseCase(listRepo);

const updateListController = new UpdateListController(updateListUseCase);

export { updateListUseCase, updateListController };
