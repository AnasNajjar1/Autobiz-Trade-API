import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Result } from '../../../core/logic/Result';
import { Offer } from './offer';
import * as Joi from 'joi';
import { Vehicle } from './vehicle';
import { Guard } from '../../../core/logic/Guard';
import { offerCreatedEvent } from '../events/offerCreatedEvent';
import { User } from '../../user/domain/user';
import { Group } from '../../group/domain/group';
import { IbestOffererDetails } from './bestOffererDetails';
export interface SaleProps {
  id?: number;
  uuid?: string;
  validationStatus?: string;
  supplyType: string;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  auctionStartPrice?: number;
  auctionStepPrice?: number;
  auctionReservePrice?: number;
  immediatePurchasePrice?: number;
  startDateTime: Date;
  endDateTime: Date;
  vehicleId?: number;
  offers?: Offer[];
  countOffers?: number;
  countAuctions?: number;
  bestAuction?: number;
  bestOfferType?: string;
  bestOfferer?: string;
  bestOffererDetails?: IbestOffererDetails;
  minimalAuction?: number;
  winner?: string;
  assignedWinner?: string;
  assignedWinnerOffer?: number;
  secondsBeforeStart?: number;
  secondsBeforeEnd?: number;
  status?: string;
  comment?: string;
  commentInt?: any;
  vehicle?: Vehicle;
  listId?: number;
  carcheckId?: number;
  expressSale?: boolean;
  groupId?: number;
  group?: Group;
  ownerId?: number;
  owner?: User;
  createdBy?: string;
  updatedBy?: string;

  userInfo?: any;

  isBookmarkedByUser?: boolean;
}

export class Sale extends AggregateRoot<SaleProps> {
  private MINIMAL_SUBMISSION: number = 200;
  private MINIMAL_SUBMISSION_STEP: number = 1;

  constructor(props: SaleProps, id?: number) {
    super(props, id);
    if (!id) {
      props.uuid = uuidv4();
    }
  }

  get uuid(): string {
    return this.props.uuid;
  }

  get validationStatus(): string {
    return this.props.validationStatus ? this.props.validationStatus : 'DRAFT';
  }
  set validationStatus(validationStatus: string) {
    this.props.validationStatus = validationStatus;
  }

  get supplyType(): string {
    return this.props.supplyType;
  }
  set supplyType(supplyType: string) {
    this.props.supplyType = supplyType;
  }

  get acceptAuction(): boolean {
    return this.props.acceptAuction;
  }
  set acceptAuction(acceptAuction: boolean) {
    this.props.acceptAuction = acceptAuction;
  }

  get acceptImmediatePurchase(): boolean {
    return this.props.acceptImmediatePurchase;
  }
  set acceptImmediatePurchase(acceptImmediatePurchase: boolean) {
    this.props.acceptImmediatePurchase = acceptImmediatePurchase;
  }

  get acceptSubmission(): boolean {
    return this.props.acceptSubmission;
  }
  set acceptSubmission(acceptSubmission: boolean) {
    this.props.acceptSubmission = acceptSubmission;
  }

  get auctionStartPrice(): number {
    return this.props.auctionStartPrice;
  }
  set auctionStartPrice(auctionStartPrice: number) {
    this.props.auctionStartPrice = auctionStartPrice;
  }

  get auctionStepPrice(): number {
    return this.props.auctionStepPrice;
  }
  set auctionStepPrice(auctionStepPrice: number) {
    this.props.auctionStepPrice = auctionStepPrice;
  }

  get auctionReservePrice(): number {
    return this.props.auctionReservePrice;
  }
  set auctionReservePrice(auctionReservePrice: number) {
    this.props.auctionReservePrice = auctionReservePrice;
  }

  get immediatePurchasePrice(): number {
    return this.props.immediatePurchasePrice;
  }
  set immediatePurchasePrice(immediatePurchasePrice: number) {
    this.props.immediatePurchasePrice = immediatePurchasePrice;
  }

  get startDateTime(): Date {
    return this.props.startDateTime;
  }
  set startDateTime(startDateTime: Date) {
    this.props.startDateTime = startDateTime;
  }

  get endDateTime(): Date {
    return this.props.endDateTime;
  }
  set endDateTime(endDateTime: Date) {
    this.props.endDateTime = endDateTime;
  }

  public updateEndDateTime(endDateTime: Date): Result<void> {
    this.props.endDateTime = endDateTime;

    return Result.ok<void>();
  }

  get vehicle(): Vehicle {
    return this.props.vehicle;
  }

  get vehicleId(): number {
    return this.props.vehicleId;
  }
  set vehicleId(vehicleId: number) {
    this.props.vehicleId = vehicleId;
  }

  get offers(): Offer[] {
    return this.props.offers;
  }

  get comment(): string {
    return this.props.comment;
  }
  set comment(comment: string) {
    this.props.comment = comment;
  }

  get commentInt(): any {
    return this.props.commentInt;
  }
  set commentInt(commentInt: any) {
    this.props.commentInt = commentInt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }
  set createdBy(createdBy: string) {
    this.props.createdBy = createdBy;
  }

  get updatedBy(): string {
    return this.props.updatedBy;
  }
  set updatedBy(updatedBy: string) {
    this.props.updatedBy = updatedBy;
  }

  get listId(): number {
    return this.props.listId;
  }
  set listId(listId: number) {
    this.props.listId = listId;
  }

  get carcheckId(): number {
    return this.props.carcheckId;
  }
  set carcheckId(carcheckId: number) {
    this.props.carcheckId = carcheckId;
  }

  get expressSale(): boolean {
    return this.props.expressSale;
  }
  set expressSale(expressSale: boolean) {
    this.props.expressSale = expressSale;
  }

  get groupId(): number {
    return this.props.groupId;
  }
  set groupId(groupId: number) {
    this.props.groupId = groupId;
  }

  get group(): Group {
    return this.props.group;
  }

  get ownerId(): number {
    return this.props.ownerId;
  }
  set ownerId(ownerId: number) {
    this.props.ownerId = ownerId;
  }

  get owner(): User {
    return this.props.owner;
  }

  get winner(): string {
    return this.props.winner;
  }

  set winner(assignedWinner: string) {
    this.props.winner = assignedWinner;
  }

  get assignedWinner(): string {
    return this.props.assignedWinner;
  }
  set assignedWinner(assignedWinner: string) {
    this.props.assignedWinner = assignedWinner;
  }

  get assignedWinnerOffer(): number {
    return this.props.assignedWinnerOffer;
  }

  set assignedWinnerOffer(assignedWinnerOffer: number) {
    this.props.assignedWinnerOffer = assignedWinnerOffer;
  }

  get requestWinner(): boolean {
    if (
      (this.status === 'CLOSED' ||
        this.status === 'FINISHED' ||
        this.status === 'ARCHIVED') &&
      this.countOffers > 0 &&
      !this.winner
    ) {
      return true;
    } else {
      return false;
    }
  }

  get deleteWinner(): boolean {
    if (
      (this.status === 'CLOSED' ||
        this.status === 'FINISHED' ||
        this.status === 'ARCHIVED') &&
      this.countOffers > 0 &&
      this.winner
    ) {
      return true;
    } else {
      return false;
    }
  }

  get countOffers(): number {
    return this.props.countOffers;
  }

  get countAuctions(): number {
    return this.props.countAuctions ? this.props.countAuctions : 0;
  }

  get bestAuction(): number {
    return this.props.bestAuction ? this.props.bestAuction : 0;
  }

  get bestOfferType(): string {
    return this.props.bestOfferType;
  }

  public bestOffer(): number {
    if (this.props.bestOfferType === 'immediatePurchase') {
      return this.props.immediatePurchasePrice;
    } else if (this.props.bestOfferType === 'auction') {
      return this.props.bestAuction;
    }
    return null;
  }

  get bestOfferer(): string {
    return this.props.bestOfferer;
  }

  get minimalAuction(): number {
    if (this.props.minimalAuction) {
      return this.props.minimalAuction;
    } else if (this.props.acceptAuction) {
      return this.props.auctionStartPrice;
    }
    return undefined;
  }

  get isAuctionOpen(): boolean {
    return this.acceptAuction && ['LIVE', 'SCHEDULED'].includes(this.status);
  }

  get isImmediatePurchaseOpen(): boolean {
    return (
      this.acceptImmediatePurchase &&
      ['LIVE', 'SCHEDULED'].includes(this.status)
    );
  }

  get isSubmissionOpen(): boolean {
    if (this.acceptSubmission && ['LIVE', 'SCHEDULED'].includes(this.status)) {
      if (this.countAuctions > 0) {
        if (
          this.auctionReservePrice &&
          this.auctionReservePriceIsReached === false
        ) {
          return true;
        }

        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  get auctionReservePriceIsReached(): boolean {
    if (this.bestAuction < this.auctionReservePrice) {
      return false;
    }

    return true;
  }

  get secondsBeforeStart(): number {
    return this.props.secondsBeforeStart;
  }

  get secondsBeforeEnd(): number {
    return this.props.secondsBeforeEnd;
  }

  get status(): string {
    return this.props.status;
  }

  get isBookmarkedByUser(): boolean {
    return this.props.isBookmarkedByUser;
  }

  public isSold(): boolean {
    return this.props.status === 'CLOSED' && Boolean(this.props.winner);
  }

  public isOwner(userId): boolean {
    return this.props.owner
      ? this.props.owner?.autobizUserId?.value === userId
      : false;
  }

  public addOffer(offer: Offer) {
    this.props.offers.push(offer);

    return Result.ok<void>();
  }

  public getUrl(): string {
    return '#';
  }

  get userInfo(): any {
    return this.props.userInfo;
  }

  get bestOfferAmount(): number {
    const amount = this.props.offers.map((o) => o.amount);
    const maxVal = Math.max(...amount);
    return maxVal;
  }

  get bestOffererDetails(): IbestOffererDetails {
    return this.props.bestOffererDetails;
  }

  set bestOffererDetails(bestOffererDetails: IbestOffererDetails) {
    this.props.bestOffererDetails = bestOffererDetails;
  }

  public calculateUserInfo(userId: string) {
    if (!this.props.offers) {
      return null;
    }

    let bestUserSubmission: number = null;
    let bestUserAuction: number = null;
    let minimalUserSubmission: number = this.MINIMAL_SUBMISSION;
    let bestUserOffer: number = null;
    let userWin: boolean = false;
    let userBestOfferer: boolean = false;
    let bestUserSubmissionCreatedAt: Date = null;

    const userOffers = this.props.offers.filter((o) => o.userId === userId);

    const userSubmissions = userOffers.filter(
      (o) => o.offerType === 'submission',
    );

    const userNonSubmissions = userOffers.filter(
      (o) => o.offerType !== 'submission',
    );

    const userAuctions = userOffers.filter((o) => o.offerType === 'auction');

    if (userSubmissions.length > 0) {
      const filterBestUserSubmissions = userSubmissions.reduce(
        (prev, current) => (prev.amount > current.amount ? prev : current),
      );
      bestUserSubmission = filterBestUserSubmissions.amount;
      bestUserSubmissionCreatedAt = filterBestUserSubmissions.createdAt;
      minimalUserSubmission = bestUserSubmission + this.MINIMAL_SUBMISSION_STEP;
    }

    if (userAuctions.length > 0) {
      bestUserAuction = userAuctions.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current,
      ).amount;
    }

    if (userNonSubmissions.length > 0) {
      bestUserOffer = userNonSubmissions.reduce((prev, current) =>
        prev.amount > current.amount ? prev : current,
      ).amount;
    }

    if (this.winner === userId) {
      userWin = true;
    }

    if (this.bestOfferer === userId) {
      userBestOfferer = true;
    }

    let message: string = null;
    let success: boolean = null;

    if (this.status === 'LIVE') {
      if (this.countAuctions === 0) {
        if (userSubmissions.length > 0) {
          message = 'submission_sent';
        } else {
          message = 'no_offer';
        }
      } else {
        if (this.bestOfferer !== null && userAuctions.length > 0) {
          if (this.bestOfferer === userId) {
            message = 'highest_bidder';
            success = true;
          } else {
            message = 'overbid';
            success = false;
          }
        }
      }
    } else if (
      this.status === 'CLOSED' ||
      this.status === 'FINISHED' ||
      this.status === 'ARCHIVED'
    ) {
      switch (this.bestOfferType) {
        case 'immediatePurchase':
          message = 'too_late_sale_is_closed';
          success = false;

          break;

        case 'auction':
          message = 'too_late_auctions_are_closed';
          success = false;

          break;

        case 'submission':
          if (userBestOfferer) {
            message = 'submission_acceptation_pending';
            success = true;
          } else {
            message = 'too_late_sale_is_closed';
            success = false;
          }

          break;

        default:
          message = 'too_late_sale_is_closed';
          success = false;
          break;
      }
    }

    this.props.userInfo = {
      message,
      bestUserOffer,
      bestUserSubmission,
      bestUserAuction,
      minimalUserSubmission,
      userWin,
      userBestOfferer,
      success,
      bestUserSubmissionCreatedAt,
    };
  }

  public validate() {
    const validate = Joi.object()
      .keys({
        supplyType: Joi.string().valid('STOCK', 'OFFER_TO_PRIVATE').required(),
        validationStatus: Joi.string()
          .valid('DRAFT', 'VALIDATED', 'CANCELED')
          .required(),
        acceptAuction: Joi.bool().required(),
        acceptImmediatePurchase: Joi.bool().required(),
        acceptSubmission: Joi.bool().required(),
        auctionStartPrice: Joi.number()
          .when('acceptAuction', {
            is: true,
            then: Joi.number().min(0).required(),
          })
          .concat(
            Joi.number().when('acceptAuction', {
              is: false,
              then: Joi.number().min(0).allow(null),
            }),
          ),
        auctionStepPrice: Joi.number()
          .when('acceptAuction', {
            is: true,
            then: Joi.number().min(1).required(),
          })
          .concat(
            Joi.number().when('acceptAuction', {
              is: false,
              then: Joi.number().min(0).allow(null),
            }),
          ),
        auctionReservePrice: Joi.number()
          .when('acceptAuction', {
            is: true,
            then: Joi.number().min(0).allow(null),
          })
          .concat(
            Joi.number().when('acceptAuction', {
              is: false,
              then: Joi.number().min(0).allow(null),
            }),
          ),
        immediatePurchasePrice: Joi.number()
          .when('acceptImmediatePurchase', {
            is: true,
            then: Joi.number().min(1).required(),
          })
          .concat(
            Joi.number().when('acceptImmediatePurchase', {
              is: false,
              then: Joi.number().min(0).allow(null),
            }),
          ),
        startDateTime: Joi.date().required(),
        vehicleId: Joi.number().required(),
        endDateTime: Joi.date().greater(Joi.ref('startDateTime')).required(),
      })
      .unknown(true)
      .validate(this.props);

    if (validate.error) {
      return Result.fail<any>(validate.error.message);
    }
    return Result.ok();
  }

  public static create(props: SaleProps, id?: number): Result<Sale> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.supplyType, argumentName: 'supplyType' },
      { argument: props.startDateTime, argumentName: 'startDateTime' },
      { argument: props.endDateTime, argumentName: 'endDateTime' },
      { argument: props.vehicleId, argumentName: 'vehicleId' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Sale>(guardResult.message);
    }

    const sale = new Sale(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Sale>(sale);
  }
}
