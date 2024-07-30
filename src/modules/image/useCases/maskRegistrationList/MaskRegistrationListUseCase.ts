import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { MaskRegistrationListRequestDto } from './MaskRegistrationListRequestDto';
import { MaskRegistrationListErrors } from './MaskRegistrationListErrors';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';

type Response = Either<
  AppError.UnexpectedError | MaskRegistrationListErrors.messengerError,
  Result<[{ title: string; key: string }]>
>;

const picturesThatMayContainRegistration = [
  'back_picture',
  'front_picture',
  'left_side_picture',
  'right_side_picture',
  'three_quarters_back_left_picture',
  'three_quarters_back_picture',
  'three_quarters_front_picture',
  'three_quarters_front_right_picture',
  'inside_front_picture',
  'inside_back_picture',
  'dashboard_picture',
  'trunk_picture',
  'body_driver_back_door',
  'body_driver_back_fender',
  'body_rear_bumper',
  'body_passenger_back_fender',
  'body_passenger_side_skirt',
  'body_passenger_back_door',
  'body_passenger_front_door',
  'body_front_bumper',
  'body_driver_front_door',
  'body_passenger_front_fender',
];

export class MaskRegistrationListUseCase
  implements UseCase<MaskRegistrationListRequestDto[], Promise<Response>> {
  public messengerService: IMessengerService;

  constructor(messengerService: IMessengerService) {
    this.messengerService = messengerService;
  }

  public async execute(
    request: MaskRegistrationListRequestDto[],
  ): Promise<Response> {
    try {
      const promises = request.map(({ title, url }) => {
        if (!picturesThatMayContainRegistration.includes(title)) return;
        return this.messengerService.publishMessage('maskRegistration', {
          title,
          url,
        });
      });

      const listPictures = await Promise.all(promises);
      return right(Result.ok<any>(listPictures));
    } catch (err) {
      console.log('error send message', err.message);
      return left(new MaskRegistrationListErrors.messengerError('', ''));
    }
  }
}
