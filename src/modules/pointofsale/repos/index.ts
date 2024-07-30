// import { InMemoryPointofsaleRepo } from './implementations/inMemoryPointofsaleRepo';
// const pointofsaleRepo = new InMemoryPointofsaleRepo();

import { SequelizePointofsaleRepo } from './implementations/sequelizePointofsaleRepo';
import { SequelizePointofsaleBookmarkRepo } from './implementations/sequelizePointofsaleBookmarkRepo';
import models from '../../../infra/sequelize/models';
const pointofsaleRepo = new SequelizePointofsaleRepo(models);
const pointofsaleBookmarkRepo = new SequelizePointofsaleBookmarkRepo(models);

export { pointofsaleRepo, pointofsaleBookmarkRepo };
