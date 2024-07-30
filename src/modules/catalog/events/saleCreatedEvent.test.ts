import { saleCreatedEvent, SaleCreatedEventProps } from './saleCreatedEvent';

describe('SaleCreated Event', () => {
  const saleCreatedProps: SaleCreatedEventProps = {
    fileNumber: '1',
    brandLabel: 'PEUGEOT',
    modelLabel: '206',
    versionLabel: 'TEST',
    mileage: 25000,
    expressSale: false,
    buyerFirstName: 'test',
    buyerLastName: 'test',
    buyerId: 'test',
    buyerEmail: 'foobar@test.fr',
    city: 'paris',
    groupName: 'test',
    offerType: 'STOCK',
    saleStatus: 'DRAFT',
  };

  test.each([
    ['DRAFT', 'STOCK', true],
    ['DRAFT', 'OFFER_TO_PRIVATE', false],
    ['VALIDATED', 'STOCK', false],
    ['VALIDATED', 'OFFER_TO_PRIVATE', false],
    ['CANCELED', 'STOCK', false],
    ['CANCELED', 'OFFER_TO_PRIVATE', false],
  ])(
    'send mail depends on offer type and sale status',
    async (status, offer, shouldSendEmail) => {
      const email = await saleCreatedEvent({
        ...saleCreatedProps,
        saleStatus: status,
        offerType: offer,
      });
      if (shouldSendEmail === true) {
        expect(email).toBeDefined();
      } else {
        expect(email).toBeUndefined();
      }
    },
  );
});
