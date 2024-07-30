import { Vehicle } from './../../../catalog/domain/vehicle';

export type SendPartnerRequestProps = {
  vehicle: Vehicle;
  uuid: string;
  saleComment: string;
  senderEmail?: string;
};

export type SendPartnerRequestDto = {
  uuid: string;
};