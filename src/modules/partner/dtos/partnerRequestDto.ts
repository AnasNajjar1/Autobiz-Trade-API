import { VehicleAdminShortDto } from "../../catalog/dtos/vehicleDto";

export interface PartnerRequestDto {
  id: number;
  uuid: string;
  vehicleId: number;
  partnerId: number;
  partnerName: string;
  statusId: number;
  statusName: string;
  comment: string;
  saleComment: string;
  lastOfferCreatedAt: Date;
  value: number;
  offerComment: string;
  createdAt: Date;
  createdBy?: string;
  vehicle: VehicleAdminShortDto;
}
