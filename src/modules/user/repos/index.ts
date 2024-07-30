// import { InMemoryUserRepo } from './implementations/inMemoryUserRepo';
// const userRepo = new InMemoryUserRepo();

import { SequelizeUserRepo } from './implementations/sequelizeUserRepo';
import models from '../../../infra/sequelize/models';
const userRepo = new SequelizeUserRepo(models);

export { userRepo };
