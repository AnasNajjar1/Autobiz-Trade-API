import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';
import * as Joi from 'joi';

interface OfferProps {
  id?: number;
  amount: number;
  offerType: string;
  userId: string;
  saleId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Offer extends Entity<OfferProps> {
  constructor(props: OfferProps, id?: number) {
    super(props, id);
  }

  get id(): number {
    return this._id;
  }

  get amount(): number {
    return this.props.amount;
  }

  get offerType(): string {
    return this.props.offerType;
  }

  get userId(): string {
    return this.props.userId;
  }

  get saleId(): number {
    return this.props.saleId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: OfferProps, id?: number): Result<Offer> {
    const schema = Joi.object().keys({
      amount: Joi.number().required(),
      offerType: Joi.string()
        .valid('auction', 'immediatePurchase', 'submission')
        .required(),
      userId: Joi.string().required(),
      saleId: Joi.number().required(),
      createdAt: Joi.date().allow(null),
    });

    const validate = schema.validate(props);

    if (validate.error) {
      return Result.fail<Offer>(validate.error.details[0].message); //TODO: display all messages not only the first one
    } else {
      return Result.ok<Offer>(
        new Offer(
          {
            ...props,
          },
          id,
        ),
      );
    }
  }
}
