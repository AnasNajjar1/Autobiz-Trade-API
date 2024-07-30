import { MakeOfferErrors } from './MakeOfferErrors';
import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Offer } from '../../../domain/offer';
import { Sale } from '../../../domain/sale';
import { MakeOfferRequestDto } from './MakeOfferRequestDto';
import { ISaleRepo } from '../../../repos/saleRepo';
import { OfferSaleType } from '../../../domain/offerSaleType';
import moment from 'moment';
import { IOfferRepo } from '../../../repos/offerRepo';
import { offerCreatedEvent } from '../../../events/offerCreatedEvent';
import { SaleMap } from '../../../mappers/SaleMap';

type Response = Either<
  | AppError.UnexpectedError
  | MakeOfferErrors.SaleNotFoundError
  | MakeOfferErrors.OfferIsNotValidError
  | MakeOfferErrors.UserIdIsNotValidError,
  Result<any>
>;

export class MakeOfferUseCase
  implements UseCase<MakeOfferRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private offerRepo: IOfferRepo;

  constructor(saleRepo: ISaleRepo, offerRepo: IOfferRepo) {
    this.saleRepo = saleRepo;
    this.offerRepo = offerRepo;
  }

  private async getSale(
    uuid: string,
    userId: string,
  ): Promise<Either<MakeOfferErrors.SaleNotFoundError, Result<Sale>>> {
    try {
      const sale = await this.saleRepo.getSaleByUuid(uuid, userId);

      return right(Result.ok<Sale>(sale)) as Response;
    } catch (err) {
      return left(new MakeOfferErrors.SaleNotFoundError(uuid)) as Response;
    }
  }
  public async execute(req: MakeOfferRequestDto): Promise<Response> {
    let sale: Sale;
    const MINIMAL_SUBMISSION = 200;
    const SECONDS_LEFT_CLOSING_SOON_SALE_AUCTION = 30;

    try {
      // check if saleType is acceptable

      const offerSaleTypeOrError = OfferSaleType.create(req.offerType);
      if (offerSaleTypeOrError.isFailure) {
        return left(offerSaleTypeOrError) as Response;
      }

      // find Sale
      const saleOrError = await this.getSale(req.saleUuid, req.userId);

      if (saleOrError.isLeft()) {
        return left(saleOrError) as Response;
      }

      sale = saleOrError.value.getValue();

      if (sale.status !== 'LIVE') {
        return left(
          new MakeOfferErrors.SaleNotFoundError(sale.uuid),
        ) as Response;
      }

      //an owner can't make offer

      if (sale.isOwner(req.userId)) {
        return left(new MakeOfferErrors.UserIdIsNotValidError()) as Response;
      }
      // a submission has a minimum amount

      if (req.offerType === 'submission') {
        if (sale.isSubmissionOpen === false) {
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        }

        if (req.amount < MINIMAL_SUBMISSION) {
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        }
      }

      if (req.offerType === 'auction') {
        if (sale.isAuctionOpen === false)
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        if (req.amount < sale.minimalAuction) {
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        }

        // if sale end soon, postone the end for 3 minutes
        const endDateTime = moment(sale.endDateTime);
        const minutesLeft = moment().diff(endDateTime, 'second') * -1;

        if (minutesLeft <= SECONDS_LEFT_CLOSING_SOON_SALE_AUCTION) {
          const endDateTimePostponed = endDateTime
            .add(SECONDS_LEFT_CLOSING_SOON_SALE_AUCTION, 'second')
            .utc()
            .format();

          sale.updateEndDateTime(new Date(endDateTimePostponed));
        }
      }

      // when immediate amount must be immediatePurchasePrice
      if (req.offerType === 'immediatePurchase') {
        if (sale.isImmediatePurchaseOpen === false)
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        if (req.amount !== sale.immediatePurchasePrice) {
          return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
        }

        //sale.updateEndDateTime(new Date());
      }

      const offerOrError = Offer.create({
        amount: req.amount,
        offerType: req.offerType,
        userId: req.userId,
        saleId: sale.id,
      });

      if (offerOrError.isFailure) {
        return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
      }

      const offer = offerOrError.getValue();
      sale.addOffer(offer);
      // sending mail to owner when submission OR sending mail to looser when auction
      await offerCreatedEvent(offer, sale);

      await this.saleRepo.save(sale);
      try {
        await this.offerRepo.save(offer);
      } catch (err) {
        return left(new MakeOfferErrors.OfferIsNotValidError()) as Response;
      }

      const saleInfo = await this.saleRepo.getSaleInfo(sale.uuid, req.userId);

      return right(Result.ok(saleInfo));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
