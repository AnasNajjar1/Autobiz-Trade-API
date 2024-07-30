import { Entity } from '../../../core/domain/Entity';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { Vehicle } from '../../catalog/domain/vehicle';

interface PartnerRequestProps {
  id?: number;
  uuid?: string;
  vehicleId: number;
  partnerId: number;
  partnerName?: string;
  statusId: number;
  statusName?: string;
  comment: string;
  saleComment: string;
  lastOfferCreatedAt?: Date;
  value?: number;
  offerComment?: string;
  createdAt: Date;
  createdBy?: string;
  vehicle?: Vehicle;
}

export class PartnerRequest extends Entity<PartnerRequestProps> {
  constructor(props: PartnerRequestProps, id?: number) {
    super(props, id);
  }

  get partnerRequestId(): number {
    return this._id;
  }

  get uuid(): string {
    return this.props.uuid;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get vehicleId(): number {
    return this.props.vehicleId;
  }
  get vehicle(): Vehicle {
    return this.props.vehicle;
  }

  get partnerId(): number {
    return this.props.partnerId;
  }

  get partnerName(): string {
    return this.props.partnerName;
  }

  get statusId(): number {
    return this.props.statusId;
  }

  get statusName(): string {
    return this.props.statusName;
  }

  get comment(): string {
    return this.props.comment;
  }

  get saleComment(): string {
    return this.props.saleComment;
  }

  get lastOfferCreatedAt(): Date {
    return this.props.lastOfferCreatedAt;
  }

  get value(): number {
    return this.props.value;
  }
  get offerComment(): string {
    return this.props.offerComment;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: PartnerRequestProps,
    id?: number,
  ): Result<PartnerRequest> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.vehicleId, argumentName: 'vehicleId' },
      { argument: props.statusId, argumentName: 'statusId' },
      { argument: props.partnerId, argumentName: 'partnerId' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<PartnerRequest>(guardResult.message);
    }

    return Result.ok<PartnerRequest>(
      new PartnerRequest(
        {
          ...props,
        },
        id,
      ),
    );
  }
}
