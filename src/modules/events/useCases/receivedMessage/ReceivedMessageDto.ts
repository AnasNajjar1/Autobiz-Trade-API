export type MessageSubjects =
  | 'newVehicles'
  | 'endSaleNotification'
  | 'newConnexion'
  | 'maskRegistration'
  | 'logCall'
  | 'assignedWinnerNotification'
  | 'sendPartnerRequest'
  | 'compressMainPhoto'
  | 'createSaleVehicle'
  | 'uploadVehicleImage';

export interface Request {
  subject: MessageSubjects;
  data: any;
}
