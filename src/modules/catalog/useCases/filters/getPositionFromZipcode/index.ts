import { GetPositionFromZipcodeUseCase } from './GetPositionFromZipcodeUseCase';
import { GetPositionFromZipcodeController } from './GetPositionFromZipcodeController';
import { geoCodeService } from '../../../../../config/services';

const getPositionFromZipcodeUseCase = new GetPositionFromZipcodeUseCase(
  geoCodeService,
);

const getPositionFromZipcodeController = new GetPositionFromZipcodeController(
  getPositionFromZipcodeUseCase,
);

const getPositionFromZipcodeHandler = (event) => {
  return getPositionFromZipcodeController.execute(event);
};

export {
  getPositionFromZipcodeUseCase,
  getPositionFromZipcodeController,
  getPositionFromZipcodeHandler,
};
