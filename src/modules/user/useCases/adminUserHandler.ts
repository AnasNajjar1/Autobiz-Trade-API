import { getUserByIdController } from './getUserById';
import { getUsersController } from './getUsers';
import { deleteUserByIdController } from './deleteUserById';
import { createUserController } from './createUser';
import { updateUserController } from './updateUser';

export const main = (event) => {
  switch (event.httpMethod) {
    default:
    case `GET`:
      if (event.pathParameters?.id) {
        return getUserByIdController.execute(event);
      } else {
        return getUsersController.execute(event);
      }
    case 'POST':
      return createUserController.execute(event);
    case 'PUT':
      return updateUserController.execute(event);
    case 'DELETE':
      return deleteUserByIdController.execute(event);
  }
};
