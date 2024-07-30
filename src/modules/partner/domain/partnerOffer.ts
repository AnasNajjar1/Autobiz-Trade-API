import { Entity } from '../../../core/domain/Entity';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface PartnerOfferProps {
  id?: number;
  value: number;
  comment: string;
  partnerRequestId: number;
  ipSource: string;
}

export class PartnerOffer extends Entity<PartnerOfferProps> {
  constructor(props: PartnerOfferProps, id?: number) {
    super(props, id);
  }

  get partnerOfferId(): number {
    return this._id;
  }

  get value(): number {
    return this.props.value;
  }

  get comment(): string {
    return this.props.comment;
  }

  get partnerRequestId(): number {
    return this.props.partnerRequestId;
  }

  get ipSource(): string {
    return this.props.ipSource;
  }

  public static create(
    props: PartnerOfferProps,
    id?: number,
  ): Result<PartnerOffer> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.value, argumentName: 'value' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<PartnerOffer>(guardResult.message);
    }

    return Result.ok<PartnerOffer>(
      new PartnerOffer(
        {
          ...props,
        },
        id,
      ),
    );
  }
}
