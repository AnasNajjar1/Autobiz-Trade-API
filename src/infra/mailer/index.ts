import { SESMailerService } from './SESMailerService';
import { InMemoryMailerService } from './InMemoryMailerService';
let mailerService;

if (process.env.NODE_ENV === 'test') {
  mailerService = new InMemoryMailerService();
} else {
  mailerService = new SESMailerService();
}

export { mailerService };
