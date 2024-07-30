import create from './create';
import show from './show';
import list from './list';

export async function main(event) {
  const { path, httpMethod } = event;
  //const type = _.get(event, 'pathParameters.any', '');
  const type = event?.pathParameters?.any ?? '';

  switch (httpMethod) {
    case `GET`:
      switch (type) {
        case '':
          return await list();
        default:
          return await show(type);
      }

    case 'POST':
    case 'PUT':
      return await create(event, type);
  }
}
