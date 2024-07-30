import { Offer } from '../domain/offer';
import { Sale } from '../domain/sale';
import { getUserInfos } from '../../../infra/deprecated/user-lib';
import { t } from '../../../infra/deprecated/translate-lib';

import { IMailerService } from '../../../infra/mailer/mailerService';
import { SESMailerService } from '../../../infra/mailer/SESMailerService';

export async function offerCreatedEvent(
  offer: Offer,
  sale: Sale,
  mailerService?: IMailerService,
  userApiService?: any,
) {
  if (mailerService === undefined) {
    mailerService = new SESMailerService();
  }

  if (userApiService === undefined) {
    userApiService = getUserInfos;
  }

  if (offer.offerType === 'auction') {
    const newBestOfferer = offer.userId;
    const oldBestOfferer = sale.bestOfferer;

    // new BestOfferer is different from old BestOfferer, send email to old BestOfferer
    if (oldBestOfferer && newBestOfferer !== oldBestOfferer) {
      // get oldBestOfferer email and language
      const userInfos = await userApiService(oldBestOfferer);
      const { email, country: language } = userInfos;

      if (!email) {
        console.warn(
          'outbidding mail not sent : no email for ' + oldBestOfferer,
        );
        return;
      }

      const { vehicle } = sale;

      const emailVars = {
        brandLabel: vehicle.brandLabel,
        modelLabel: vehicle.modelLabel || '',
        versionLabel: vehicle.versionLabel || '',
        firstRegistrationDateYear: vehicle.firstRegistrationDate
          ? new Date(vehicle.firstRegistrationDate).getFullYear()
          : '',
        mileage: vehicle.mileage || '',
        city: vehicle.pointofsale?.city || '',
        link: `${process.env.siteUrl}/records/${sale.uuid}`,
      };

      // get subject and body email for oldBestOfferer language
      const subject = t(language, `subject_outbidding`, emailVars);
      const content = t(language, `body_outbidding`, emailVars);

      console.warn(`outbidding mail sent : to ${oldBestOfferer}, ${email} `);
      console.warn(subject);
      console.warn(content);
      return mailerService.sendMail(email, subject, content);
    } else {
      console.warn('outbidding mail not sent : no old BestOfferer ');
    }
  } else if (
    (offer.offerType === 'submission', sale.supplyType === 'OFFER_TO_PRIVATE')
  ) {
    if (sale.owner?.autobizUserId?.value) {
      const ownerInfos = await userApiService(sale.owner.autobizUserId.value);
      const { email, country: language } = ownerInfos;
      const offerer = await userApiService(offer.userId);
      const { vehicle } = sale;
      const { pointofsale } = vehicle;
      const emailVars = {
        brandLabel: vehicle.brandLabel ? vehicle.brandLabel : '',
        modelLabel: vehicle.modelLabel ? vehicle.modelLabel : '',
        versionLabel: vehicle.versionLabel ? vehicle.versionLabel : '',
        mileage: vehicle.mileage ? vehicle.mileage : '',
        POS_name: pointofsale.name ? pointofsale.name : '',
        POS_zipCode: pointofsale.zipCode ? pointofsale.zipCode : '',
        POS_city: pointofsale.city ? pointofsale.city : '',
        fileNumber: vehicle.fileNumber ? vehicle.fileNumber.value : '',
        firstRegistrationDateYear: vehicle.firstRegistrationDate
          ? new Date(vehicle.firstRegistrationDate).getFullYear()
          : '',
        link: `${process.env.carcheckUrl}`,
        firstname: offerer.firstname ? offerer.firstname : '',
        lastname: offerer.lastname ? offerer.lastname : '',
        OfferAmount: offer.amount.toLocaleString(),
      };
      const subject = t(language, `subject_newOfferCoverageRequest`, emailVars);
      const content = t(language, `body_newOfferCoverageRequest`, emailVars);
      console.warn(`submission mail sent : to  ${email} `);
      console.warn(subject);
      console.warn(content);
      return mailerService.sendMail(email, subject, content);
    } else {
      console.warn('submission mail not sent : no owner ');
    }
  }
}
