import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Pointofsale } from '../../domain/pointofsale';
import { UpdatePointofsaleErrors } from './UpdatePointofsaleErrors';
import { WithChanges, Changes } from '../../../../core/logic/WithChanges';
import { PointofsalePicture } from '../../domain/pointofsalePicture';
import { PointofsaleDocumentation } from '../../domain/pointofsaleDocumentation';
import { PointofsaleLatitude } from '../../domain/pointofsaleLatitude';
import { PointofsaleLongitude } from '../../domain/pointofsaleLongitude';
import { PointofsaleCountry } from '../../domain/pointofsaleCountry';
import { ITranslateService } from '../../../../infra/translate/translateService';
type Response = Either<
  AppError.UnexpectedError | Result<any>,
  Result<Pointofsale>
>;

interface Request {
  id: number;
  name: string;
  picture: string;
}

export class UpdatePointofsaleUseCase
  implements UseCase<Request, Promise<Response>>, WithChanges {
  private pointofsaleRepo: IPointofsaleRepo;
  public changes: Changes;
  private translateService: ITranslateService;

  constructor(
    pointofsaleRepo: IPointofsaleRepo,
    translateService?: ITranslateService,
  ) {
    this.pointofsaleRepo = pointofsaleRepo;
    this.changes = new Changes();
    this.translateService = translateService;
  }

  public async execute(request: any): Promise<Response> {
    let pointofsale: Pointofsale;
    const pointofsaleId = request.id;

    try {
      pointofsale = await this.pointofsaleRepo.getPointofsaleById(
        pointofsaleId,
      );
    } catch (err) {
      return left(
        new UpdatePointofsaleErrors.PointofsaleNotFoundError(pointofsaleId),
      ) as Response;
    }

    if (request?.name !== undefined) {
      this.changes.addChange(pointofsale.updateName(request.name));
    }

    if (request?.picture !== undefined) {
      const pictureOrError: Result<PointofsalePicture> = PointofsalePicture.create(
        request.picture,
      );

      if (pictureOrError.isSuccess) {
        this.changes.addChange(
          pointofsale.updatePicture(pictureOrError.getValue()),
        );
      } else {
        return left(pictureOrError);
      }
    }

    if (request?.info !== undefined) {
      this.changes.addChange(pointofsale.updateInfo(request.info));
    }

    if (request?.paymentDeadline !== undefined) {
      this.changes.addChange(
        pointofsale.updatePaymentDeadline(request.paymentDeadline),
      );
      const paymentDeadlineInt = await this.translateService.translateText(
        request.paymentDeadline,
      );
      this.changes.addChange(
        pointofsale.updatePaymentDeadlineInt(
          JSON.stringify(paymentDeadlineInt),
        ),
      );
    }

    if (request?.pickupDeadline !== undefined) {
      this.changes.addChange(
        pointofsale.updatePickupDeadline(request.pickupDeadline),
      );
      const pickupDeadlineInt = await this.translateService.translateText(
        request.pickupDeadline,
      );
      this.changes.addChange(
        pointofsale.updatePickupDeadlineInt(JSON.stringify(pickupDeadlineInt)),
      );
    }

    if (request?.comments !== undefined) {
      this.changes.addChange(pointofsale.updateComments(request.comments));
      const commentInt = await this.translateService.translateText(
        request.comments,
      );
      this.changes.addChange(
        pointofsale.updateCommentsInt(JSON.stringify(commentInt)),
      );
    }

    if (request?.documentation !== undefined) {
      const documentationOrError: Result<PointofsaleDocumentation> = PointofsaleDocumentation.create(
        request.documentation,
      );

      if (documentationOrError.isSuccess) {
        this.changes.addChange(
          pointofsale.updateDocumentation(documentationOrError.getValue()),
        );
      } else {
        return left(documentationOrError);
      }
    }

    if (request?.city !== undefined) {
      this.changes.addChange(pointofsale.updateCity(request.city));
    }

    if (request?.zipCode !== undefined) {
      this.changes.addChange(pointofsale.updateZipCode(request.zipCode));
    }

    if (request?.country !== undefined) {
      this.changes.addChange(pointofsale.updateCountry(request.country));
    }

    if (request?.country !== undefined) {
      const countryOrError: Result<PointofsaleCountry> = PointofsaleCountry.create(
        request.country,
      );

      if (countryOrError.isSuccess) {
        this.changes.addChange(
          pointofsale.updateCountry(countryOrError.getValue()),
        );
      } else {
        return left(countryOrError);
      }
    }

    if (request?.latitude !== undefined) {
      const latitudeOrError: Result<PointofsaleLatitude> = PointofsaleLatitude.create(
        request.latitude,
      );

      if (latitudeOrError.isSuccess) {
        this.changes.addChange(
          pointofsale.updateLatitude(latitudeOrError.getValue()),
        );
      } else {
        return left(latitudeOrError);
      }
    }

    if (request?.longitude !== undefined) {
      const longitudeOrError: Result<PointofsaleLongitude> = PointofsaleLongitude.create(
        request.longitude,
      );

      if (longitudeOrError.isSuccess) {
        this.changes.addChange(
          pointofsale.updateLongitude(longitudeOrError.getValue()),
        );
      } else {
        return left(longitudeOrError);
      }
    }

    this.changes.addChange(pointofsale.updateCompany(request.company));

    if (this.changes.getCombinedChangesResult().isSuccess) {
      try {
        await this.pointofsaleRepo.save(pointofsale);

        return right(Result.ok<Pointofsale>(pointofsale));
      } catch (err) {
        return left(new AppError.UnexpectedError(err)) as Response;
      }
    }
  }
}
