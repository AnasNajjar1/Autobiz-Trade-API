import { SequelizeImportRepo } from './implementations/sequelizeImportRepo';
import models from '../../../infra/sequelize/models';

const importRepo = new SequelizeImportRepo(models);

export { importRepo };
