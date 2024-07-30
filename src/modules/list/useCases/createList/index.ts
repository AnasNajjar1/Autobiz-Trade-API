import { CreateListUseCase } from './CreateListUseCase';
import { CreateListController } from './CreateListController';
import { listRepo } from '../../repos';

const createListUseCase = new CreateListUseCase(listRepo);

const createListController = new CreateListController(createListUseCase);

export { createListUseCase, createListController };
