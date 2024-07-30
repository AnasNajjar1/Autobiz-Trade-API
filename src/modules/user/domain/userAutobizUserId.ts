import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface UserAutobizUserIdProps {
  value?: string;
}

export class UserAutobizUserId extends ValueObject<UserAutobizUserIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserAutobizUserIdProps) {
    super(props);
  }

  public static create(value: string): Result<UserAutobizUserId> {
    const rule = Joi.string()
      .required()
      //TODO: Fix this when add user won't accept undefined_undefined user
      //.regex(new RegExp('^([A-Z]{2})_([0-9]+)$'))
      .label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<UserAutobizUserId>(validate.error.message);
    }

    return Result.ok<UserAutobizUserId>(new UserAutobizUserId({ value }));
  }
}
