// import { InMemoryPartnerRepo } from './implementations/inMemoryPartnerRepo';
// const partnerRepo = new InMemoryPartnerRepo();

import models from '../../../infra/sequelize/models';
import { SequelizePartnerRepo } from './implementations/sequelizePartnerRepo';
import { SequelizePartnerOfferRepo } from './implementations/sequelizePartnerOfferRepo';
import { SequelizePartnerRequestRepo } from './implementations/sequelizePartnerRequestRepo';

const partnerRepo = new SequelizePartnerRepo(models);
const partnerOfferRepo = new SequelizePartnerOfferRepo(models);
const partnerRequestRepo = new SequelizePartnerRequestRepo(models);

export { partnerRepo, partnerOfferRepo, partnerRequestRepo };
