import { left, Result, right, Either } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IFileService } from '../../../../infra/fileService/FileService';
import { IVehicleRepo } from '../../repos/vehicleRepo';
import { VehicleImageImportRequestDto } from './VehicleImageImportRequestDto';
import _ from 'lodash';
import { VehicleCarPictures } from '../../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../../domain/vehicleCarPicturesOthers';
import { WithChanges, Changes } from '../../../../core/logic/WithChanges';
import { Vehicle } from '../../domain/vehicle';
import { VehicleDocuments } from '../../domain/vehicleDocuments';
import { MaskRegistrationUseCase } from '../../../image/useCases/maskRegistration/MaskRegistrationUseCase';
import { CompressingVehicleMainPhotoUseCase } from '../vehicles/compressingVehicleMainPhoto/CompressingVehicleMainPhotoUseCase';
import { VehicleImageImportErrors } from './VehicleImageImportErrors';
import { setVehiclesCarPictures } from '../../../../shared/helpers/VehicleHelper';
import { IImportRepo } from '../../../fileImport/repos/importRepo';

type Response = Either<
  VehicleImageImportErrors.VehicleNotFoundError | AppError.UnexpectedError,
  Result<any>
>;

type Document = {
  link: string;
  label: string;
};

type CarPicturesElement = {
  listCarPictures: Document[];
  listNewCarPictures: Object;
  listNewOtherPictures: Document[];
  pdfReport: Document;
};

export class VehicleImageImportUseCase
  implements
    UseCase<VehicleImageImportRequestDto, Promise<Response>>,
    WithChanges
{
  private importRepo: IImportRepo;
  private fileService: IFileService;
  private vehicleRepo: IVehicleRepo;
  private maskRegistrationUseCase: MaskRegistrationUseCase;
  private compressingVehicleMainPhotoUseCase: CompressingVehicleMainPhotoUseCase;
  public changes: Changes;

  public constructor(
    importRepo: IImportRepo,
    fileService: IFileService,
    vehicleRepo: IVehicleRepo,
    maskRegistrationUseCase: MaskRegistrationUseCase,
    compressingVehicleMainPhotoUseCase: CompressingVehicleMainPhotoUseCase,
  ) {
    this.importRepo = importRepo;
    this.fileService = fileService;
    this.vehicleRepo = vehicleRepo;
    this.maskRegistrationUseCase = maskRegistrationUseCase;
    this.compressingVehicleMainPhotoUseCase =
      compressingVehicleMainPhotoUseCase;
    this.changes = new Changes();
  }

  public async execute(
    request: VehicleImageImportRequestDto,
  ): Promise<Response> {
    const { link, uuid } = request;
    try {
      const fileBody = await this.fileService.getArchive(link);
      let msg = '';
      await Promise.all(
        _.map(fileBody, async (documents, registration) => {
          const result = await this.updateVehicleImages(
            documents,
            registration,
          );

          if (result?.isLeft())
            msg += result.value.errorValue().message + '</br> ';
        }),
      );
      await this.importRepo.update(msg, 'finished', uuid);
      return right(Result.ok(uuid));
    } catch (err) {
      console.warn(err.message);
      await this.importRepo.update(err.message, 'failed', uuid);
      return left(Result.fail(err.message));
    }
  }

  public async updateVehicleImages(
    documents: Document[],
    registration: string,
  ): Promise<any> {
    let vehicle;
    try {
      vehicle = await this.vehicleRepo.getLastVehicleByRegistration(
        registration,
      );
      if (!vehicle) {
        vehicle = await this.vehicleRepo.getLastVehicleByVin(registration);
      }
    } catch (err) {
      return left(
        new VehicleImageImportErrors.VehicleNotFoundError(registration),
      );
    }

    if (vehicle) {
      const {
        listCarPictures,
        listNewCarPictures,
        listNewOtherPictures,
        pdfReport,
      } = this.carPicturesElement(documents);

      this.updateVehicleCarPictures(listNewCarPictures, vehicle);
      this.updateVehicleOtherCarPictures(listNewOtherPictures, vehicle);
      this.updateVehiclePdf(pdfReport, vehicle);
      //await this.maskCarPictures(listCarPictures);

      try {
        if (this.changes.getCombinedChangesResult().isFailure) throw Error();
        const id = await this.vehicleRepo.save(vehicle);
        await this.compressingVehicleMainPhotoUseCase.execute({ id });
        return right(Result.ok(registration));
      } catch (err) {
        return left(
          new VehicleImageImportErrors.UpdateVehicleFailed(registration),
        );
      }
    }
  }

  private updateVehicleCarPictures(
    listNewCarPictures: Object,
    vehicle: Vehicle,
  ): any {
    if (!_.isEmpty(vehicle.carPictures?.value)) {
      const vehicleCarPictures = vehicle.carPictures?.value;
      listNewCarPictures = setVehiclesCarPictures(
        vehicleCarPictures,
        listNewCarPictures,
      );
    }
    const carPicturesOrError: Result<VehicleCarPictures> =
      VehicleCarPictures.create(listNewCarPictures);
    if (carPicturesOrError.isFailure)
      return left(
        new VehicleImageImportErrors.UnexpectedError(
          vehicle.registration,
          carPicturesOrError.error,
        ),
      );
    this.changes.addChange(
      vehicle.updateCarPictures(carPicturesOrError.getValue()),
    );
  }

  private updateVehicleOtherCarPictures(
    listNewOtherPictures: Document[],
    vehicle: Vehicle,
  ): any {
    listNewOtherPictures.map((picture) => {
      const otherPic = vehicle.carPicturesOthers?.value;
      const carPicturesOthersOrError: Result<VehicleCarPicturesOthers> =
        VehicleCarPicturesOthers.create([
          ...otherPic,
          {
            title: picture.label,
            link: picture.link,
          },
        ]);
      if (carPicturesOthersOrError.isFailure)
        return left(
          new VehicleImageImportErrors.UnexpectedError(
            vehicle.registration,
            carPicturesOthersOrError.error,
          ),
        );
      this.changes.addChange(
        vehicle.updateCarPicturesOthers(carPicturesOthersOrError.getValue()),
      );
    });
  }

  private updateVehiclePdf(pdfReport: Document, vehicle: Vehicle): any {
    if (pdfReport) {
      const documentsOrError: Result<VehicleDocuments> =
        VehicleDocuments.create([
          {
            link: pdfReport.link,
            title: 'pdfReport',
          },
        ]);
      if (documentsOrError.isFailure)
        return left(
          new VehicleImageImportErrors.UnexpectedError(
            vehicle.registration,
            documentsOrError.error,
          ),
        );
      this.changes.addChange(
        vehicle.updateDocuments(documentsOrError.getValue()),
      );
    }
  }

  private async maskCarPictures(listPictures: any[]): Promise<any> {
    const promises = listPictures.map(async (list) => {
      return await this.maskRegistrationUseCase.execute({ url: list.link });
    });
    await Promise.all(promises).catch((err) => {
      return left(new VehicleImageImportErrors.MaskPicturesFailed(err));
    });
  }

  private carPicturesElement(documents: Document[]): CarPicturesElement {
    const listCarPictures = documents.filter(
      (doc) => doc.link.split('.').pop() !== 'pdf',
    );

    const pdfReport = documents.find(
      (doc) => doc.link.split('.').pop() === 'pdf',
    );

    const threeQuarterPicture = listCarPictures.find((picture) =>
      ['three_quarters_front_picture', '1'].includes(picture.label),
    );

    const listNewCarPictures = threeQuarterPicture
      ? {
          three_quarters_front_picture: threeQuarterPicture.link,
        }
      : {
          three_quarters_front_picture: listCarPictures[0].link,
        };

    const listNewOtherPictures = listCarPictures.filter(
      (picture) =>
        picture.link !== listNewCarPictures.three_quarters_front_picture,
    );

    return {
      listCarPictures,
      listNewCarPictures,
      listNewOtherPictures,
      pdfReport,
    };
  }
}
