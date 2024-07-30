import { getGroupByIdController } from './getGroupById';
import { getGroupsController } from './getGroups';
import { createGroupController } from './createGroup';
import { updateGroupController } from './updateGroup';
import { deleteGroupByIdController } from './deleteGroupById';

export const main = (event) => {
  switch (event.httpMethod) {
    default:
    case `GET`:
      if (event.pathParameters?.id) {
        return getGroupByIdController.execute(event);
      } else {
        return getGroupsController.execute(event);
      }
    case 'POST':
      return createGroupController.execute(event);
    case 'PUT':
      return updateGroupController.execute(event);
    case 'DELETE':
      return deleteGroupByIdController.execute(event);
  }
};
