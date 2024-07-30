import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Pointofsale } from '../../domain/pointofsale';
import { CreatePointofsaleErrors } from './CreatePointofsaleErrors';
import { PointofsalePicture } from '../../domain/pointofsalePicture';
import { IDealerImporterService } from '../../../../infra/import/dealer/DealerImporterService';
import { PointofsaleCountry } from '../../domain/pointofsaleCountry';
import { PointofsaleDocumentation } from '../../domain/pointofsaleDocumentation';
import { PointofsaleLatitude } from '../../domain/pointofsaleLatitude';
import { PointofsaleLongitude } from '../../domain/pointofsaleLongitude';
import { ITranslateService } from '../../../../infra/translate/translateService';
type Response = Either<
  | AppError.UnexpectedError
  | CreatePointofsaleErrors.CantImportDealer
  | Result<any>,
  Result<Pointofsale>
>;

interface Request {
  action: string;
  autobizPosId?: string;
  city?: string;
  country: string;
  comments?: string;
  documentation?: any;
  info?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  paymentDeadline?: string;
  pickupDeadline?: string;
  picture?: string;
  zipCode?: string;
  company?: string;
}

export class CreatePointofsaleUseCase
  implements UseCase<Request, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;
  private dealerImporterService: IDealerImporterService;
  private translateService: ITranslateService;
  constructor(
    pointofsaleRepo: IPointofsaleRepo,
    dealerImporterService: IDealerImporterService,
    translateService?: ITranslateService,
  ) {
    this.pointofsaleRepo = pointofsaleRepo;
    this.dealerImporterService = dealerImporterService;
    this.translateService = translateService;
  }

  public async execute(request: Request): Promise<Response> {
    // import from autobiz dealer
    if (request.action === 'import') {
      const dealer = await this.dealerImporterService.getDealer(
        request.autobizPosId,
        request.country,
      );

      if (!dealer) {
        return left(
          new CreatePointofsaleErrors.CantImportDealer(request.autobizPosId),
        ) as Response;
      }

      if (dealer.isFailure) {
        return left(Result.fail<void>(dealer.error)) as Response;
      }

      request.autobizPosId = dealer.id;
      request.city = dealer.city;
      request.country = dealer.country;
      request.latitude = dealer.latitude;
      request.longitude = dealer.longitude;
      request.name = dealer.name;
      request.zipCode = dealer.zipCode;
      request.company = dealer.company;
    }

    const countryOrError = PointofsaleCountry.create(request?.country);

    const documentationOrError = PointofsaleDocumentation.create(
      request?.documentation,
    );

    const latitudeOrError = PointofsaleLatitude.create(request?.latitude);

    const longitudeOrError = PointofsaleLongitude.create(request?.longitude);

    const pictureOrError = PointofsalePicture.create(request?.picture);

    const combinedPropsResult = Result.combine([
      countryOrError,
      documentationOrError,
      latitudeOrError,
      longitudeOrError,
      pictureOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return left(combinedPropsResult);
    }

    try {
      let pointofsale: Pointofsale;
      const autobizPosId = request?.autobizPosId;
      if (autobizPosId) {
        pointofsale = await this.pointofsaleRepo.getPointofsaleByAutobizId(
          autobizPosId,
        );
      } else {
        pointofsale = await this.pointofsaleRepo.findPointofsale(request);
      }

      //point of sale already exists
      if (pointofsale) {
        return right(Result.ok<Pointofsale>(pointofsale));
      }
      let commentsInt;
      let paymentDeadlineInt;
      let pickupDeadlineInt;
      if (request?.paymentDeadline) {
        paymentDeadlineInt = await this.translateService.translateText(
          request?.paymentDeadline,
        );
      }
      if (request?.pickupDeadline) {
        pickupDeadlineInt = await this.translateService.translateText(
          request?.pickupDeadline,
        );
      }
      if (request?.comments) {
        commentsInt = await this.translateService.translateText(
          request?.comments,
        );
      }
      const pointofsaleOrError: Result<Pointofsale> = Pointofsale.create({
        autobizPosId: request?.autobizPosId,
        city: request?.city,
        country: countryOrError.getValue(),
        comments: request?.comments,
        documentation: documentationOrError.getValue(),
        info: request?.info,
        latitude: latitudeOrError.getValue(),
        longitude: longitudeOrError.getValue(),
        paymentDeadline: request?.paymentDeadline,
        pickupDeadline: request?.pickupDeadline,
        name: request?.name,
        picture: pictureOrError.getValue(),
        zipCode: request?.zipCode,
        company: request?.company,
        commentsInt: JSON.stringify(commentsInt),
        paymentDeadlineInt: JSON.stringify(paymentDeadlineInt),
        pickupDeadlineInt: JSON.stringify(pickupDeadlineInt),
      });

      if (pointofsaleOrError.isFailure) {
        return left(pointofsaleOrError);
      }

      pointofsale = await this.pointofsaleRepo.save(
        pointofsaleOrError.getValue(),
      );

      return right(Result.ok<Pointofsale>(pointofsale));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
