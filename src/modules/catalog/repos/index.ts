// import { InMemorySaleRepo } from './implementations/inMemorySaleRepo';
// const saleRepo = new InMemorySaleRepo();
// export { saleRepo };
import { SequelizeSaleRepo } from './implementations/sequelizeSaleRepo';
import { SequelizeSaleBookmarkRepo } from './implementations/sequelizeSaleBookmarkRepo';
import { SequelizeOfferRepo } from './implementations/sequelizeOfferRepo';
import { SequelizeVehicleRepo } from './implementations/sequelizeVehicleRepo';

import models from '../../../infra/sequelize/models';

const saleRepo = new SequelizeSaleRepo(models);
const saleBookmarkRepo = new SequelizeSaleBookmarkRepo(models);
const offerRepo = new SequelizeOfferRepo(models);
const vehicleRepo = new SequelizeVehicleRepo(models);

export { saleRepo, saleBookmarkRepo, offerRepo, vehicleRepo };
