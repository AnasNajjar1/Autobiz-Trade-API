import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IFileService } from '../../../../infra/fileService/FileService';
import { Import } from '../../domain/import';
import { CreateImportVehicleImageRequestDto } from './importVehicleImageRequestDto';
import { IImportRepo } from '../../repos/importRepo';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';

type Response = Either<
  AppError.UnexpectedError,
  Result<any>
>;

export class ImportVehicleImageUseCase
  implements UseCase<any, Promise<Response>>
{
  public fileService: IFileService;
  private importRepo: IImportRepo;
  private messengerService: IMessengerService;

  constructor(
    fileService: IFileService,
    importRepo: IImportRepo,
    messengerService: IMessengerService,
  ) {
    this.fileService = fileService;
    this.importRepo = importRepo;
    this.messengerService = messengerService;
  }

  public async execute(dto: CreateImportVehicleImageRequestDto): Promise<any> {
    const { link, createdBy, uuid } = dto;

    try {
      const importOrError: Result<Import> = Import.create({
        link,
        createdBy,
        uuid,
        status: 'started',
        importType: 'vehicleImage',
      });
      if (importOrError.isFailure) {
        throw new Error('Entity can not created');
      }
      const result = await this.importRepo.save(importOrError.getValue());

      await this.messengerService.publishMessage('uploadVehicleImage', {
        link,
        uuid,
      });

      return right(Result.ok(result));
    } catch (e) {
      return left(new AppError.UnexpectedError(e.message));
    }
  }
}
