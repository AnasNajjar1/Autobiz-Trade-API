import { t } from '../infra/deprecated/translate-lib';
import { getUserInfos } from '../infra/deprecated/user-lib';
import { Op } from 'sequelize';
import models from '../infra/sequelize/models';
import { mailerService } from '../infra/mailer';

export async function main() {
  const notifications = await models.notification.findAll({
    attributes: ['id', 'data', 'type', 'mailSentAt'],
    where: {
      mailSentAt: { [Op.eq]: null },
      mailSentError: { [Op.eq]: null },
      viaMail: 1,
    },
    include: {
      model: models.user,
    },
  });

  for (const n of notifications) {
    try {
      const user = await getUserInfos(n.user.autobizUserId);
      const email = user && user.email;
      const country = user.country && user.country.toLowerCase();

      if (!email) {
        throw new Error('no email');
      }

      const subject = t(country, `subject_${n.type}`, JSON.parse(n.data));
      const content = t(country, `body_${n.type}`, JSON.parse(n.data));

      n.mailSentAt = new Date();
      console.log('send email', email, subject);
      await mailerService.sendMail(email, subject, content);
      await n.save();
    } catch (error) {
      console.warn('Error', error.message, n.user.autobizUserId);

      n.mailSentError = error.message;
      await n.save();
    }
  }
  return null;
}
