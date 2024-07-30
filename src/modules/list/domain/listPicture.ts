import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface ListPictureProps {
  value?: string;
}

export class ListPicture extends ValueObject<ListPictureProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ListPictureProps) {
    super(props);
  }

  public static create(value: string): Result<ListPicture> {
    const rule = Joi.string().allow(null).label(this.name).uri();

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<ListPicture>(validate.error.message);
    }

    return Result.ok<ListPicture>(new ListPicture({ value }));
  }
}
