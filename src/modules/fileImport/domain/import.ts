import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';
import * as Joi from 'joi';

interface ImportProps {
  id?: number;
  uuid: string;
  status: string;
  notification?: string;
  link: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  importType?: string;
}

export class Import extends Entity<ImportProps> {
  constructor(props: ImportProps, id?: number) {
    super(props, id);
  }

  get id(): number {
    return this._id;
  }

  get uuid(): string {
    return this.props.uuid;
  }

  get status(): string {
    return this.props.status;
  }

  get notification(): string {
    return this.props.notification;
  }

  get link(): string {
    return this.props.link;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get importType(): string {
    return this.props.importType;
  }
  set importType(importType: string) {
    this.props.importType = importType;
  }

  public static create(props: ImportProps, id?: number): Result<Import> {
    const schema = Joi.object().keys({
      uuid: Joi.string().required(),
      status: Joi.string().valid('started', 'finished', 'failed').allow(null),
      notification: Joi.string().allow(null),
      link: Joi.string().required(),
      createdBy: Joi.string().allow(null),
      createdAt: Joi.date().allow(null),
      updatedAt: Joi.date().allow(null),
      importType: Joi.string().valid('vehicleSale', 'vehicleImage'),
    });

    const validate = schema.validate(props);
    if (validate.error) {
      return Result.fail<Import>(validate.error.details[0].message); //TODO: display all messages not only the first one
    } else {
      return Result.ok<Import>(
        new Import(
          {
            ...props,
          },
          id,
        ),
      );
    }
  }
}
