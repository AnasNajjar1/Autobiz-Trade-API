import { LogCallUseCase } from './LogCallUseCase';
import { saveJsonService } from '../../../../infra/saveJson';

const logCallUseCase = new LogCallUseCase(saveJsonService);

export { logCallUseCase };
