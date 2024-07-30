// import { InMemoryListRepo } from './implementations/inMemoryListRepo';
// const listRepo = new InMemoryListRepo();

import { SequelizeListRepo } from './implementations/sequelizeListRepo';
import models from '../../../infra/sequelize/models';
const listRepo = new SequelizeListRepo(models);

export { listRepo };
