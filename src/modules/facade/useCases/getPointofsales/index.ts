import { GetPointofsalesUseCase } from './GetPointofsalesUseCase';
import { GetPointofsalesController } from './GetPointofsalesController';
import { pointofsaleRepo } from '../../repos';

const getPointofsalesUseCase = new GetPointofsalesUseCase(pointofsaleRepo);

const getPointofsalesController = new GetPointofsalesController(
  getPointofsalesUseCase,
);

export { getPointofsalesUseCase, getPointofsalesController };
