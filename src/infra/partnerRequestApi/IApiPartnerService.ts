export interface IApiPartnerRequestService {
  sendPartnerRequest(
    partner: string,
    vehicle: object,
    schema: object,
    url: string,
  ): Promise<any>;
}
