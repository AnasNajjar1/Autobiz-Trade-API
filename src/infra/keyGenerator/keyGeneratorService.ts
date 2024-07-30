import randomstring from 'randomstring';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class KeyGenerator {
  generate(): string {
    return randomstring.generate({
      length: 8,
      charset: 'alphanumeric',
    });
  }

  generateReference(): string {
    return moment()
      .subtract(50, 'years')
      .subtract(11, 'months')
      .valueOf()
      .toString(36)
      .toUpperCase();
  }

  static uuid(): string {
    return uuidv4();
  }
}
