import { Mapper } from '../../../core/infra/Mapper';
import { Vehicle } from '../../catalog/domain/vehicle';
import equipmentsSchema from '../../../shared/schemas/equipments.json';
import _ from 'lodash';

interface VpAutoDto {
  id?: number;
  fileNumber: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  registration: string;
  vin: string;
  documents: any[];
  declaredEquipments: any[];
  damages: any[];
  constructorEquipments: VpAutoConstructorEquipmentDto;
  pointOfSale: {
    name: string;
    zipCode: string;
    city: string;
    country: string;
  };
  administrativeDetails: {
    gcDate: string;
    firstHand: string;
    vehicleType: string;
    co2: string;
    userManual: string;
    secondSetKey: string;
  };
  characteristics: {
    mileage: number;
    firstRegistrationDate: string;
    fuelLabel: string;
    liter: string;
    gearBoxLabel: string;
    seats: string;
    door: string;
    metallic: string;
    power: {
      ch: string;
      kw: string;
    };
    fiscal: string;
    wheelsFrontDimensions: {
      diameter: string;
      width: string;
      height: string;
    };
    wheelsBackDimensions: {
      diameter: string;
      width: string;
      height: string;
    };
    wheelsFrontTireBrand: string;
    wheelsBackTireBrand: string;
  };
  history: {
    origin: string;
    purchaseInvoice: string;
    vat: string;
    vatDetails: string;
    imported: string;
  };
  servicing: {
    servicingHistory: string;
    servicingInBrandNetwork: string;
    servicingManualPicture: string;
    servicingInvoices: string;
    lastServicingDate: string;
    lastServicingKm: string;
    distributionBelt: string;
    nextTechnicalCheckDate: string;
  };
  gallery: any[];
  request?: string;
  salesComment?: string;
  user?: string;
}

// type equipmentsRak = "veryImportantDatEquipment" | "veryImportantDatEquipment" | "fewImportantDatEquipment"

type VpAutoConstructorEquipmentDto = any[];
//   {veryImportantDatEquipment: string[]},
//   { importantDatEquipment: string[] },
//   { fewImportantDatEquipment: string[]}
// ]

export class VpAutoMap implements Mapper<Vehicle> {
  public static toVpAuto(vehicle: Vehicle): VpAutoDto {
    return {
      id: vehicle.id,
      fileNumber: vehicle.fileNumber?.value || '',
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,
      registration: vehicle.registration || '',
      vin: vehicle.vin,
      documents: vehicle.documents?.value,
      declaredEquipments: vehicle.declaredEquipments?.value,
      damages: vehicle.damages?.value || [],
      constructorEquipments: VpAutoMap.toVpAutoEquipment(
        vehicle.constructorEquipments?.value,
      ),
      pointOfSale: {
        name: vehicle.pointofsale?.name || '',
        zipCode: vehicle.pointofsale?.zipCode || '',
        city: vehicle.pointofsale?.city || '',
        country: vehicle.pointofsale?.country?.value || '',
      },
      administrativeDetails: {
        gcDate: vehicle.gcDate ? vehicle.gcDate.toString() : null,
        firstHand: vehicle.firstHand ? 'yes' : 'no',
        vehicleType: vehicle.vehicleType,
        co2: vehicle.co2 ? vehicle.co2.toString() : null,
        userManual: vehicle.userManual ? 'yes' : 'no',
        secondSetKey: vehicle.secondSetKey ? 'yes' : 'no',
      },
      characteristics: {
        mileage: vehicle.mileage,
        firstRegistrationDate: vehicle.firstRegistrationDate
          ? vehicle.firstRegistrationDate.toString()
          : '',
        fuelLabel: vehicle.fuelLabel,
        liter: vehicle.liter ? vehicle.liter.toString() : '',
        gearBoxLabel: vehicle.gearBoxLabel,
        seats: vehicle.seats ? vehicle.seats.toString() : '',
        door: vehicle.door ? vehicle.door.toString() : null,
        metallic: vehicle.metallic ? 'yes' : 'no',
        power: {
          ch: vehicle.ch ? vehicle.ch.toString() : null,
          kw: vehicle.kw ? vehicle.kw.toString() : null,
        },
        fiscal: vehicle.fiscal ? vehicle.fiscal.toString() : null,
        wheelsFrontDimensions: vehicle.wheelsFrontDimensions.value,
        wheelsBackDimensions: vehicle.wheelsBackDimensions.value,
        wheelsFrontTireBrand: vehicle.wheelsFrontTireBrand,
        wheelsBackTireBrand: vehicle.wheelsBackTireBrand,
      },
      history: {
        origin: vehicle.origin,
        purchaseInvoice: vehicle.purchaseInvoice,
        vat: vehicle.vat ? 'yes' : 'no',
        vatDetails: vehicle.vatDetails,
        imported: vehicle.imported ? 'yes' : 'no',
      },
      servicing: {
        servicingHistory: vehicle.servicingHistory,
        servicingInBrandNetwork: vehicle.servicingInBrandNetwork ? 'yes' : 'no',
        servicingManualPicture: vehicle.servicingManualPicture,
        servicingInvoices: vehicle.servicingInvoices ? 'yes' : 'no',
        lastServicingDate: vehicle.lastServicingDate,
        lastServicingKm: vehicle.lastServicingKm
          ? vehicle.lastServicingKm.toString()
          : null,
        distributionBelt: vehicle.distributionBelt,
        nextTechnicalCheckDate: vehicle.nextTechnicalCheckDate,
      },
      gallery: vehicle.gallery(),
    };
  }

  public static toVpAutoEquipment(data: any): VpAutoConstructorEquipmentDto {
    if (!data || !Array.isArray(data)) return null;
    const ranks = [
      'other',
      'veryImportantDatEquipment',
      'importantDatEquipment',
      'fewImportantDatEquipment',
    ];
    const equipments = [
      { veryImportantDatEquipment: [] },
      { importantDatEquipment: [] },
      { fewImportantDatEquipment: [] },
    ];
    Object.values(equipmentsSchema).map((value) => {
      Object.values(data).map((item) => {
        if (item === value.key) {
          const rank = ranks[value.rank];
          equipments[_.findKey(equipments, rank)][rank].push(item);
        }
      });
    });

    return equipments.filter((items, key) => {
      return !(
        _.isEmpty(items) || !Object.values(items).some((x) => !_.isEmpty(x))
      );
    });
  }
}
