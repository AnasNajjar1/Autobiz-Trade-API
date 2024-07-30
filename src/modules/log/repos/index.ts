import { SequelizeLogRepo } from './implementations/sequelizeLogRepo';
import models from '../../../infra/sequelize/models';
const logRepo = new SequelizeLogRepo(models);

export { logRepo };
