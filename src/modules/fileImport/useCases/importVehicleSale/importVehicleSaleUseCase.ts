import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IFileService } from '../../../../infra/fileService/FileService';
import { Import } from '../../domain/import';
import { CreateImportVehicleSaleRequestDto } from './importVehicleSaleRequestDto';
import { IImportRepo } from '../../repos/importRepo';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';

export class ImportVehicleSaleUseCase
  implements UseCase<any, Promise<Response>> {
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

  public async execute(dto: CreateImportVehicleSaleRequestDto): Promise<any> {
    const { file, createdBy, uuid } = dto;

    try {
      const link = await this.fileService.setExcel(file, uuid);

      const importOrError: Result<Import> = Import.create({
        link,
        createdBy,
        uuid,
        status: 'started',
      });
      if (importOrError.isFailure) {
        throw new Error('Entity can not created');
      }
      const result = await this.importRepo.save(importOrError.getValue());
      await this.messengerService.publishMessage('createSaleVehicle', {
        uuid,
      });
      return right(Result.ok(result));
    } catch (e) {
      return left(new AppError.UnexpectedError(e.message));
    }
  }
}
