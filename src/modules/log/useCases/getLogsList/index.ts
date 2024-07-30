import { GetLogsListUseCase } from './GetLogsListUseCase';
import { GetLogsListController } from './GetLogsListController';
import { logRepo } from '../../repos';

const getLogsListUseCase = new GetLogsListUseCase(logRepo);

const getLogsListController = new GetLogsListController(getLogsListUseCase);

const getLogsListHandler = (event) => {
  return getLogsListController.execute(event);
};

export { getLogsListUseCase, getLogsListController, getLogsListHandler };
