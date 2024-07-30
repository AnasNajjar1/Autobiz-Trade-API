import { GetOnlinePointofsalesListUseCase } from './GetOnlinePointofsalesListUseCase';
import { GetOnlinePointofsalesListController } from './GetOnlinePointofsalesListController';
import { pointofsaleRepo } from '../../repos';

const getOnlinePointofsalesListUseCase = new GetOnlinePointofsalesListUseCase(
  pointofsaleRepo,
);

const getOnlinePointofsalesListController = new GetOnlinePointofsalesListController(
  getOnlinePointofsalesListUseCase,
);

const getOnlinePointofsalesListHandler = (event) => {
  return getOnlinePointofsalesListController.execute(event);
};

export {
  getOnlinePointofsalesListUseCase,
  getOnlinePointofsalesListController,
  getOnlinePointofsalesListHandler,
};
