import { IVehicleRepo } from '../vehicleRepo';
import { VehicleMap } from '../../mappers/VehicleMap';
import { Vehicle, VehicleProps } from '../../domain/vehicle';
import vehicle from '../../../../infra/sequelize/models/vehicle';
import { VehicleFileNumber } from '../../domain/vehicleFileNumber';
import { VehicleCarPictures } from '../../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../../domain/vehicleCarPicturesOthers';

export class InMemoryVehicleRepo implements IVehicleRepo {
  private mockedVehicles;

  public constructor(mock?: VehicleProps[]) {
    this.mockedVehicles = mock;
  }

  public async getAdminVehiclesList() {}

  public async getAdminVehicleByRegistration(registration: string) {
    return new Vehicle({
      fileNumber: VehicleFileNumber.create('XXX').getValue(),
      registration: 'XXX',
    });
  }

  public async getLastVehicleByRegistration(registration: string) {
    return new Vehicle(
      {
        fileNumber: VehicleFileNumber.create('XXX').getValue(),
        registration,
        carPictures: VehicleCarPictures.create({
          label_test: 'https://www.photo.jpeg',
        }).getValue(),
        carPicturesOthers: VehicleCarPicturesOthers.create([
          { title: 'counter_picture', link: 'https://www.photo1.jpeg' },
          {
            title: 'registration_card_picture',
            link: 'https://www.photo2.jpeg',
          },
        ]).getValue(),
      },
      1,
    );
  }

  public async getLastVehicleByVin(vin: string) {
    return new Vehicle(
      {
        fileNumber: VehicleFileNumber.create('XXX').getValue(),
        vin,
        carPictures: VehicleCarPictures.create({
          label_test: 'https://www.photo.jpeg',
        }).getValue(),
        carPicturesOthers: VehicleCarPicturesOthers.create([
          { title: 'counter_picture', link: 'https://www.photo1.jpeg' },
          {
            title: 'registration_card_picture',
            link: 'https://www.photo2.jpeg',
          },
        ]).getValue(),
      },
      1,
    );
  }

  public async save(vehicle: Vehicle) {
    this.mockedVehicles.push(vehicle);
    return Promise.resolve(this.mockedVehicles.length);
  }

  public async exists(id: number) {
    return true;
  }

  public async delete(id: number) {
    return;
  }

  public async getAdminVehicleById(id: number) {
    const vehicle = this.mockedVehicles.find((vehicle) => id === vehicle.id);
    return new Vehicle(vehicle, id);
  }
}
