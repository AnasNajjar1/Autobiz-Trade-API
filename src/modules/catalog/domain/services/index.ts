import { translateService } from '../../../../infra/translate';
import { SaleService } from './saleService';

const saleService = new SaleService(translateService);

export { saleService };
