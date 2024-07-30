import { Mapper } from '../../../../../core/infra/Mapper';
import { Vehicle } from '../../../../catalog/domain/vehicle';
import _ from 'lodash';
import { VehicleDamages } from '../../../../catalog/domain/vehicleDamages';

interface EncheresVoDto {
  type: string;
  t_s_key: string;
  system: string;
  data_store: string;
  logiwin_lookup: string;
  data: {
    ext_ref: string;
    reg_plate: string;
    genre?: string;
    vin: string;
    make: string; 
    model: string; 
    derivative: string; 
    reg_date: string;
    fuel: string;
    transmission: string;
    colour: string;
    kms: number;
    kms_dial?: number;
    kms_confirm?: string;
    damages: any[];
    damage_cost?: string;
    comp_infos?: string;
    buy_back_date?: string;
    location: string;
    equipment: any[];
    options?: string;
    seats: number;
    doors: number;
    body_style?: string;
    documentation?: string;
    vat: string;
    foreign: string;
    second_hand: string;
    photos: any[];
    supplier?: {
        company: string;
        address: string;
        post_code: string;
        town: string;
        tel: string;
        fax: string;
        contact: {
            surname: string;
            name: string;
            tel: string;
            email: string
        }
    },
    response: {
        resp_url: string;
    }
  }

}

export class EncheresVoMap implements Mapper<Vehicle> {
  public static toEncheresVo(vehicle: Vehicle): EncheresVoDto {
    return {
      type: 'cotation',
      t_s_key: 'MPrtKqqTPXC5VkiV4Tq2C58iWwAPcTCKPkUGN774zGETV4LtpP',
      system: 'autobiz',
      data_store: 's4jGtSmIZLCyE6zDsDwirvGLWduJwdYGYSS98GJxTzin48OQeH',
      logiwin_lookup: 'false',
      data: {
        ext_ref: vehicle.fileNumber?.value || '',
        reg_plate: vehicle.registration || '',
        genre: null,
        vin: vehicle.vin,
        make: vehicle.brandLabel,
        model: vehicle.modelLabel,
        derivative: vehicle.versionLabel,
        reg_date: this.formatDate(vehicle.firstRegistrationDate),
        fuel: vehicle.fuelLabel,
        transmission: vehicle.gearBoxLabel,
        colour: vehicle.color,
        kms: vehicle.mileage,
        kms_dial: null,
        kms_confirm: null,
        damages: this.toEncheresVoDamages(VehicleDamages.create(vehicle.damages).getValue()),
        damage_cost: null,
        buy_back_date: null,
        location: vehicle.pointofsale.name,
        equipment: this.toEncheresVoEquipment(vehicle.declaredEquipments),
        options: null,
        seats: vehicle.seats,
        doors: vehicle.door,
        body_style: null,
        documentation: null,
        vat: vehicle.vat ? 'true' : 'false',
        foreign: vehicle.imported? 'true' : 'false',
        second_hand: vehicle.firstHand? 'true' : 'false',
        photos: vehicle.photos(),
        response: {
            resp_url: ""
        }
      }
    };
  }

  public static formatDate = (date: Date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
  }

  public static toEncheresVoDamages = (data: any) => {
    const damages = [];
    if(data && data.length>0) {
        data.map((damage) => {
            if(damage.zone && ["inner", "body", "wheels", "motor", "road_test"].includes(damage.zone)) {
                const existingDamage = damage.custom_damage && damage.custom_damage.length>0? damage.custom_damage :  damage?.damage;
                damages.push(damage?.zone+'-'+damage?.element+'-'+existingDamage);
            }  
        });
    }
    return damages;
  }

  public static toEncheresVoEquipment = (data: any) => {
    const equipments = [];

    data.map((equipment) => {
        if(["sunroof", "bluetooth", "speed_regulator", "parking_assistance", "auto_ac", "manual_ac"].includes(equipment)) {
            equipments.push(equipment);
        }
    });

    return equipments;
  }
}
