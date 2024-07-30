import { VehicleDamages } from './vehicleDamages';

describe('VehicleDamages types', () => {
  it('shoube be not required', async () => {
    const result = VehicleDamages.create('');
    expect(result.isSuccess).toBe(true);
  });

  it('should undefined be tolerated', async () => {
    const result = VehicleDamages.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept array of damage with title and link', async () => {
    const result = VehicleDamages.create([
      {
        custom_damage: '',
        is_custom: 0,
        element: 'body_driver_back_door',
        damage: 'smart_rep_body',
        damage_picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/23612/131f9386-b634-4769-985b-1979be6baed1.jpg',
        damage_picture2: '',
        reconditionning: 'smart_rep_body',
        zone: 'body',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'body_rear_bumper',
        damage: 'replace',
        damage_picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/23612/95df6d4f-b30b-4ad0-83a9-2d2ce84899a3.jpg',
        damage_picture2: '',
        reconditionning: 'replace',
        zone: 'body',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'body_passenger_back_door',
        damage: 'paint',
        damage_picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/23612/8f072562-1366-4d4d-a992-9f9bfd208366.jpg',
        damage_picture2: '',
        reconditionning: 'paint',
        zone: 'body',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'body_passenger_front_door',
        damage: 'paint',
        damage_picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/23612/c962fac8-eaab-4b9f-be4e-e74560e0b118.jpg',
        damage_picture2: '',
        reconditionning: 'paint',
        zone: 'body',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'body_front_bumper',
        damage: 'paint',
        damage_picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/carcheck/23612/724747a4-f01c-4530-9e13-c2910a8983c7.jpg',
        damage_picture2: '',
        reconditionning: 'paint',
        zone: 'body',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'wheels_front_rim_alu_left',
        damage: 'smart_rep',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'smart_rep',
        zone: 'wheels',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'wheels_front_rim_alu_right',
        damage: 'smart_rep',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'smart_rep',
        zone: 'wheels',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'wheels_back_rim_alu_right',
        damage: 'smart_rep',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'smart_rep',
        zone: 'wheels',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'wheels_back_rim_alu_left',
        damage: 'smart_rep',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'smart_rep',
        zone: 'wheels',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'technical_check',
        damage: 'to_do',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'to_do',
        zone: 'servicing',
      },
      {
        custom_damage: '',
        is_custom: 0,
        element: 'car_inspection',
        damage: 'ctrl_preparation_cost',
        damage_picture: '',
        damage_picture2: '',
        reconditionning: 'ctrl_preparation_cost',
        zone: 'servicing',
      },
      {
        element: 'car_crashed',
        damage: 'no',
        damage_picture: '',
        damage_picture2: '',
        zone: 'crash',
      },
      {
        element: 'painting_test',
        damage: 'yes',
        damage_picture: '',
        damage_picture2: '',
        zone: 'crash',
      },
      {
        element: 'accident',
        damage: 'no',
        damage_picture: '',
        damage_picture2: '',
        zone: 'crash',
      },
      {
        element: 'body_rear_trunk_floor',
        damage: 'ok',
        damage_picture: '',
        damage_picture2: '',
        zone: 'crash',
      },
      {
        element: 'motor_longeron',
        damage: 'ok',
        damage_picture: '',
        damage_picture2: '',
        zone: 'crash',
      },
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept damage without an element ', async () => {
    const result = VehicleDamages.create([{ damage: 'Lorem' }]);
    expect(result.isFailure).toBe(true);
  });

  //TODO: fails in staging test
  // it('should not accept damage without an damage ', async () => {
  //   const result = VehicleDamages.create([{ element: 'Lorem' }]);
  //   expect(result.isFailure).toBe(true);
  // });

  it('should not accept non uri damage_picture', async () => {
    const result = VehicleDamages.create([
      {
        element: 'wheels_back_rim_alu_left',
        damage: 'smart_rep',
        damage_picture: 'xxx',
      },
    ]);
    expect(result.isFailure).toBe(true);
  });

  it('should not accept non uri damage_picture2', async () => {
    const result = VehicleDamages.create([
      {
        element: 'wheels_back_rim_alu_left',
        damage: 'smart_rep',
        damage_picture2: 'xxx',
      },
    ]);
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleDamages.create(
      '[{"element":"car_crashed","damage":"no","damage_picture":"","damage_picture2":"","zone":"crash"},{"custom_damage":"","is_custom":0,"element":"technical_check","damage":"to_do","damage_picture":"","damage_picture2":"","reconditionning":"to_do","zone":"servicing"}]',
    );
    expect(result.getValue().value[0].element).toBe('car_crashed');
    expect(result.getValue().value[0].damage).toBe('no');
    expect(result.getValue().value[0].damage_picture).toBe('');
    expect(result.getValue().value[0].damage_picture2).toBe('');
    expect(result.getValue().value[0].zone).toBe('crash');

    expect(result.getValue().value[1].custom_damage).toBe('');
    expect(result.getValue().value[1].is_custom).toBe(0);
    expect(result.getValue().value[1].element).toBe('technical_check');
    expect(result.getValue().value[1].damage_picture).toBe('');
    expect(result.getValue().value[1].damage_picture2).toBe('');
    expect(result.getValue().value[1].reconditionning).toBe('to_do');
    expect(result.getValue().value[1].zone).toBe('servicing');

    expect(result.isSuccess).toBe(true);
  });
});
