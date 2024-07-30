import { SequelizeNotificationRepo } from './implementations/sequelizeNotificationRepo';
import models from '../../../infra/sequelize/models';
const notificationRepo = new SequelizeNotificationRepo(models);

export { notificationRepo };
