import { getListByIdController } from './getListById';
import { getListsController } from './getLists';
import { deleteListByIdController } from './deleteListById';
import { createListController } from './createList';
import { updateListController } from './updateList';

export const main = (event) => {
  switch (event.httpMethod) {
    default:
    case `GET`:
      if (event.pathParameters?.id) {
        return getListByIdController.execute(event);
      } else {
        return getListsController.execute(event);
      }
    case 'POST':
      return createListController.execute(event);
    case 'PUT':
      return updateListController.execute(event);
    case 'DELETE':
      return deleteListByIdController.execute(event);
  }
};
