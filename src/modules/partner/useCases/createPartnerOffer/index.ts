import create from './create';

export async function createPartnerOfferHandler(event, context) {
  return await create(event, context);
}
