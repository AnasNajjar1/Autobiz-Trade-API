import { getPointofsaleByIdController } from './getPointofsaleById';
import { getPointofsalesController } from './getPointofsales';
import { deletePointofsaleByIdController } from './deletePointofsaleById';
import { createPointofsaleController } from './createPointofsale';
import { updatePointofsaleController } from './updatePointofsale';

export const main = (event) => {
  switch (event.httpMethod) {
    default:
    case `GET`:
      if (event.pathParameters?.id) {
        return getPointofsaleByIdController.execute(event);
      } else {
        return getPointofsalesController.execute(event);
      }
    case 'POST':
      return createPointofsaleController.execute(event);
    case 'PUT':
      return updatePointofsaleController.execute(event);
    case 'DELETE':
      return deletePointofsaleByIdController.execute(event);
  }
};
