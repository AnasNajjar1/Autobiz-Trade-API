import { Mapper } from '../../../core/infra/Mapper';
import { IbestOffererDetails } from '../domain/bestOffererDetails';

export class bestOffererDetailsMap implements Mapper<IbestOffererDetails> {
  public static toAdminDto(
    bestOfferer: IbestOffererDetails,
  ): IbestOffererDetails {
    return {
      fullName: bestOfferer.fullName,
      email: bestOfferer.email,
      phoneNumber: bestOfferer.phoneNumber ? bestOfferer.phoneNumber : '-',
    };
  }
}
