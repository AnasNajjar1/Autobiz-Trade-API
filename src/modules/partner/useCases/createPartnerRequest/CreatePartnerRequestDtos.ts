export interface CreatePartnerRequestDto {
  vehicleId: number;
  partnerId: number;
  comment: string;
  createdBy?: string;
}

export type CreatePartnerRequestPropsDto = {
  vehicleId: number;
  partnerId: number;
  saleComment: string;
  uuid?: string;
  createdBy?: string;
};

export type CreatePartnerResponseDto = {
  uuid: string;
};

export type UpdatePartnerRequestPropsDto = {
  uuid: string;
  statusId: number;
  comment: string;
};
