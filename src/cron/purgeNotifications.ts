import models from '../infra/sequelize/models';
import { Op } from 'sequelize';
import moment from 'moment';

export async function main() {
  const DESTROY_VEHICLE_BEFORE_DATE = moment()
    .subtract(7, 'days')
    .toISOString();

  return models.notification.destroy({
    where: {
      createdAt: { [Op.lt]: DESTROY_VEHICLE_BEFORE_DATE },
      [Op.or]: [
        { mailSentAt: { [Op.not]: null } },
        { mailSentError: { [Op.not]: null } },
      ],
      viaMail: 1,
    },
  });
}
