import { getPartnersListController } from './getPartnersList';
import { getPartnerOffersListController } from './getPartnerOffersList';
import { getPartnerRequestsListController } from './getPartnerRequestsList';
import { createPartnerRequestController } from './createPartnerRequest';
import create from './createRequest/createRequest';

export async function main(event, context) {
  const { httpMethod, path } = event;
  switch (httpMethod) {
    case `GET`:
      switch (path.replace('v2/', '')) {
        case '/admin/partner':
          return await getPartnersListController.execute(event);
        case '/admin/partner/offers':
          return await getPartnerOffersListController.execute(event);
        case '/admin/partner/requests':
          return await getPartnerRequestsListController.execute(event);
      }
      break;

    case 'POST':
      //return await create(event, context);
      return await createPartnerRequestController.execute(event);

    default:
      return;
  }
}
