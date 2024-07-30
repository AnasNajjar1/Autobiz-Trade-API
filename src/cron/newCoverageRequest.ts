const Op = require('sequelize').Op;
import models from '../infra/sequelize/models';
import moment from 'moment';

export async function main() {
  const NEW_VEHICULE_START_DATE_AT = moment().subtract(7, 'day').toISOString();

  const sales = await models.sale.findAll({
    attributes: ['id', 'uuid', 'groupId', 'startDateTime'],
    include: [
      { model: models.salesStats, where: { status: 'LIVE' } },
      {
        attributes: [
          'fileNumber',
          'brandLabel',
          'modelLabel',
          'versionLabel',
          'mileage',
          'firstRegistrationDate',
        ],
        model: models.vehicle,
        include: [
          {
            attributes: ['name', 'zipCode', 'city', 'country'],
            model: models.pointofsale,
          },
        ],
      },
    ],
    where: {
      supplyType: 'OFFER_TO_PRIVATE',
      startDateTime: {
        [Op.gt]: NEW_VEHICULE_START_DATE_AT,
      },
    },
  });

  const notifications = [];

  for (const s of sales) {
    let users = [];

    if (s.groupId) {
      // vehicle is private send to scope group
      users = await getUsersByScope('group', s.groupId);
    } else if (s.vehicle?.pointofsale?.country) {
      // vehicle is public send to scope country
      users = await getUsersByScope('country', s.vehicle.pointofsale.country);
    }

    //prepare notification data

    const { vehicle } = s;
    const { pointofsale } = vehicle;
    const notificationData = {
      brandLabel: vehicle.brandLabel ? vehicle.brandLabel : '',
      modelLabel: vehicle.modelLabel ? vehicle.modelLabel : '',
      versionLabel: vehicle.versionLabel ? vehicle.versionLabel : '',
      mileage: vehicle.mileage ? vehicle.mileage : '',
      POS_name: pointofsale.name ? pointofsale.name : '',
      POS_zipCode: pointofsale.zipCode ? pointofsale.zipCode : '',
      POS_city: pointofsale.city ? pointofsale.city : '',
      firstRegistrationDateYear: vehicle.firstRegistrationDate
        ? new Date(vehicle.firstRegistrationDate).getFullYear()
        : '',

      link: `${process.env.siteUrl}/records/${s.uuid}`,
    };

    for (const u of users) {
      notifications.push({
        data: JSON.stringify(notificationData),
        userId: u.id,
        type: 'newCoverageRequest',
        referenceTable: 'sales',
        referenceId: s.id,
        viaMail: true,
        viaApp: false,
      });
    }
  }

  return await Promise.all(
    notifications.map((n) => {
      createNotification(n);
    }),
  );
}

async function createNotification(n) {
  const { userId, type, referenceTable, referenceId } = n;

  const nExists = await models.notification.count({
    where: { userId, type, referenceTable, referenceId },
  });

  if (nExists === 0) {
    return await models.notification.create(n);
  }
  return null;
}

async function getUsersByScope(type, value) {
  let dbUsers;

  if (type === 'group') {
    dbUsers = await models.user.findAll({
      attributes: ['id', 'autobizUserId'],
      where: {
        notificationNewPush: 1,
      },
      include: {
        model: models.group,
        as: 'inGroups',
        where: {
          id: value,
        },
      },
    });
  }

  if (type === 'country') {
    dbUsers = await models.user.findAll({
      attributes: ['id', 'autobizUserId'],
      where: {
        notificationNewPush: 1,
        autobizUserId: {
          [Op.startsWith]: `${value}_%`,
        },
      },
    });
  }

  const users = [];
  dbUsers.map((u) => {
    users.push({
      id: u.get().id,
      autobizUserId: u.get().autobizUserId,
    });
  });

  return users;
}
