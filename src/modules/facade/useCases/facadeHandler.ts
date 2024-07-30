import { getBrandsController } from './getBrands';
import { getModelsController } from './getModels';
import { getPointofsalesController } from './getPointofsales';
import { getImportRecordListController } from '../../import/useCases/getImportRecordList';
import { getImportRecordDetailController } from '../../import/useCases/getImportRecordDetail';
import getUsersController from './getUsers/getUsersController';

export const main = (event) => {
  const { path } = event || '';

  const poppedPath = path.split('/').pop();

  switch (path) {
    case '/admin/facade/Brand':
      return getBrandsController.execute(event);
    case '/admin/facade/Model':
      return getModelsController.execute(event);
    case '/admin/facade/PointOfSale':
      return getPointofsalesController.execute(event);
    case '/admin/facade/User':
      return getUsersController(event);
    case '/admin/facade/Carcheck':
      return getImportRecordListController.execute(event);
    case `/admin/facade/Carcheck/${poppedPath}`:
      return getImportRecordDetailController.execute(event);

    default:
      return;
  }
};
