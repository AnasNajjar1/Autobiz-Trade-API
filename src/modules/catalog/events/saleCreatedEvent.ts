import { t } from '../../../infra/deprecated/translate-lib';
import { mailerService } from '../../../infra/mailer';

export interface SaleCreatedEventProps {
  fileNumber: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  mileage: number;
  expressSale: boolean;
  buyerFirstName: string;
  buyerLastName: string;
  buyerId: string;
  buyerEmail: string;
  city: string;
  groupName: string;
  offerType: string;
  saleStatus: string;
  ownerCountry: string;
}
export async function saleCreatedEvent(record: SaleCreatedEventProps) {
  const emailVars = {
    fileNumber: record.fileNumber,
    brandLabel: record.brandLabel,
    modelLabel: record.modelLabel,
    versionLabel: record.versionLabel,
    mileage: record.mileage,
    userFirstName: record.buyerFirstName,
    userLastName: record.buyerLastName,
    userId: record.buyerId,
    manualOrExpressSale: record.expressSale ? 'EXPRESS' : 'MANUELLE',
    city: record.city,
    groupName: record.groupName,
    ownerCountry: record.ownerCountry,
  };
  const subject = t('fr', 'subject_pendingVehicles', emailVars);
  const content = t('fr', 'body_pendingVehicles', emailVars);
  if (record.offerType === 'STOCK' && record.saleStatus === 'DRAFT') {
    console.warn(record.buyerEmail, subject, content);
    return mailerService.sendMail(record.buyerEmail, subject, content);
  }
}
