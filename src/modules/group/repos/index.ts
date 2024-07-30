// import { InMemoryGroupRepo } from './implementations/inMemoryGroupRepo';
// const groupRepo = new InMemoryGroupRepo();

import { SequelizeGroupRepo } from './implementations/sequelizeGroupRepo';
import models from '../../../infra/sequelize/models';
const groupRepo = new SequelizeGroupRepo(models);

export { groupRepo };
