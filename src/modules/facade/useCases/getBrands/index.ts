import { GetBrandsUseCase } from './GetBrandsUseCase';
import { GetBrandsController } from './GetBrandsController';
import { brandRepo } from '../../repos';

const getBrandsUseCase = new GetBrandsUseCase(brandRepo);

const getBrandsController = new GetBrandsController(getBrandsUseCase);

export { getBrandsUseCase, getBrandsController };
