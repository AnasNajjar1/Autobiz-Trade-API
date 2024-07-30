import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Result } from '../../../core/logic/Result';
import { Offer } from './offer';
import { Vehicle } from './vehicle';
import { Guard } from '../../../core/logic/Guard';

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
  minimalAuction?: number;
  winner?: string;
  assignedWinner?: string;
  secondsBeforeStart?: number;
  secondsBeforeEnd?: number;
  status?: string;
  comment?: string;
  commentInt?: any;
  vehicle?: Vehicle;
  listId?: number;
  groupId?: number;
  ownerId?: number;
  createdBy?: string;
  updatedBy?: string;

  isBookmarkedByUser?: boolean;
}

export class Sale extends AggregateRoot<SaleProps> {
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

  get groupId(): number {
    return this.props.groupId;
  }
  set groupId(groupId: number) {
    this.props.groupId = groupId;
  }

  get ownerId(): number {
    return this.props.ownerId;
  }
  set ownerId(ownerId: number) {
    this.props.ownerId = ownerId;
  }

  get winner(): string {
    return this.props.winner;
  }

  get assignedWinner(): string {
    return this.props.assignedWinner;
  }
  set assignedWinner(assignedWinner: string) {
    this.props.assignedWinner = assignedWinner;
  }

  get requestWinner(): boolean {
    if (
      (this.status === 'CLOSED' || this.status === 'FINISHED') &&
      this.countOffers > 0 &&
      !this.winner
    ) {
      return true;
    } else {
      return false;
    }
  }

  get countOffers(): number {
    return this.props.countOffers;
    //return this.props.offers.getItems().length;
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
      if (this.auctionReservePrice && this.auctionReservePriceIsReached) {
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

  public static create(props: SaleProps, id?: number): Result<Sale> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.supplyType, argumentName: 'supplyType' },
      { argument: props.startDateTime, argumentName: 'startDateTime' },
      { argument: props.endDateTime, argumentName: 'endDateTime' },
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
