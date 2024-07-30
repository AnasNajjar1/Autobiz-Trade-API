import { Vehicle } from '../domain/vehicle';

export interface IVehicleRepo {
  getAdminVehiclesList(searchQuery?: any): Promise<any>;
  getAdminVehicleById(id: number): Promise<Vehicle>;
  getAdminVehicleByRegistration(registration: string): Promise<Vehicle>;
  getLastVehicleByRegistration(registration: string): Promise<Vehicle>;
  getLastVehicleByVin(vin: string): Promise<Vehicle>;
  delete(vehicleId: number, user: string): Promise<void>;
  save(vehicle: Vehicle): Promise<number>;
  exists(id: number): Promise<Boolean>;
}
