const Sequelize = require('sequelize');
const mysql2 = require('mysql2');
const config = require('../config/config');
const { writeLog } = require('../logging');

const env = process.env.stage;

const _config = config[env];

let models = {};
(function (config) {
  if (Object.keys(models).length) {
    return models;
  }

  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: '3306',
      logging: false, //env === 'dev' ? true : false,
      dialect: 'mysql',
      dialectModule: mysql2,
      pool: {
        // minimum size
        min: 2,

        // maximum size
        max: 10,

        // acquire promises are rejected after this many milliseconds
        // if a resource cannot be acquired
        acquireTimeoutMillis: 30000,

        // create operations are cancelled after this many milliseconds
        // if a resource cannot be acquired
        createTimeoutMillis: 30000,

        // destroy operations are awaited for at most this many milliseconds
        // new resources will be created after this timeout
        destroyTimeoutMillis: 5000,

        // free resouces are destroyed after this many milliseconds
        idleTimeoutMillis: 30000,

        // how often to check for idle resources to destroy
        reapIntervalMillis: 1000,

        // how long to idle after failed create before trying again
        createRetryIntervalMillis: 200,

        // If true, when a create fails, the first pending acquire is
        // rejected with the error. If this is false (the default) then
        // create is retried until acquireTimeoutMillis milliseconds has
        // passed.
        propagateCreateError: false,
      },
    },
  );

  // TODO : Make dynamic import (fails currently with webpack)
  let modules = [
    require('./group'),
    require('./groupMember'),
    require('./groupOwner'),
    require('./list'),
    require('./notification'),
    require('./pointOfSale'),
    require('./pointOfSaleBookmark'),
    require('./sale'),
    require('./saleBookmark'),
    require('./saleOffer'),
    require('./salesStats'),
    require('./status'),
    require('./user'),
    require('./vehicle'),
    require('./partner'),
    require('./partnerRequestStatus'),
    require('./partnerRequest'),
    require('./partnerOffer'),
    require('./partnerLastOffer'),
    require('./log'),
    require('./import'),
  ];

  modules.forEach((module) => {
    const model = module(sequelize, Sequelize, config);
    models[model.name] = model;
  });

  Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });

  models.sale.addHook('afterCreate', 'logSaleCreate', (sale) => {
    writeLog('C', 'sales', sale, models.log);
  });

  models.sale.addHook('beforeUpdate', 'logSaleUpdate', (sale) => {
    writeLog('U', 'sales', sale, models.log);
  });

  models.sale.addHook('afterDestroy', 'logSaleDestroy', (sale) => {
    writeLog('D', 'sales', sale, models.log);
  });

  models.vehicle.addHook('afterCreate', 'logVehicleCreate', (vehicle) => {
    writeLog('C', 'vehicles', vehicle, models.log);
  });

  models.vehicle.addHook('beforeUpdate', 'logVehicleUpdate', (vehicle) => {
    writeLog('U', 'vehicles', vehicle, models.log);
  });

  models.vehicle.addHook('afterDestroy', 'logVehicleDestroy', (vehicle) => {
    writeLog('D', 'vehicles', vehicle, models.log);
  });

  models.sequelize = sequelize;

  return models;
})(_config);

export default models;
