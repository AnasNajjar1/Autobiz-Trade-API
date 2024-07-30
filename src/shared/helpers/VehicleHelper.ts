import _ from 'lodash';

const omit = (obj, props) => {
  obj = { ...obj };
  props.forEach((prop) => delete obj[prop]);
  return obj;
};

export function getVehiclesPicturesOthers(gallery: any) {
  const othersPictures = omit(gallery, [
    'three_quarters_front_picture',
    'front_picture',
    'left_side_picture',
    'right_side_picture',
    'back_picture',
    'motor_picture',
    'trunk_picture',
    'inside_front_picture',
    'dashboard_picture',
    'inside_back_picture',
    'counter_picture',
    'vin_picture',
  ]);

  const vehicleCarPicturesOthers = [];
  Object.entries(othersPictures).map(([title, link]) => {
    vehicleCarPicturesOthers.push({ title, link });
  });
  return vehicleCarPicturesOthers;
}

export const translateColor = {
  NOIR: 'black',
  ARDOISE: 'slate',
  GRIS: 'grey',
  SABLE: 'sand',
  MARRON: 'brown',
  ROUGE: 'red',
  VIOLET: 'purple',
  ROSE: 'pink',
  BLEU: 'blue',
  ORANGE: 'orange',
  JAUNE: 'yellow',
  VERT: 'green',
  BEIGE: 'beige',
  BLANC: 'white',
};

export function translateVehiclesColors(color: string) {
  return _.get(translateColor, `${color}`, color.toLowerCase());
}

export function formatRegistration(format, registration) {
  let formatedRegistration = '';
  for (
    let im = 0, is = 0;
    im < format.length && is < registration.length;
    im++
  ) {
    formatedRegistration +=
      format.charAt(im) === 'X' ? registration.charAt(is++) : format.charAt(im);
  }
  return formatedRegistration;
}
export function formatRegistrationWithoutDash(registration) {
  return registration
    .split(' ')
    .join('')
    .split('-')
    .join('')
    .split('_')
    .join('');
}

export const randomHexaId = (size) => {
  const refHexa = [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  return (
    'I' +
    (Math.floor(Math.random() * 2)
      ? refHexa.toLowerCase()
      : refHexa.toUpperCase())
  );
};

export function setVehiclesCarPictures(gallery: any, listPictures: any) {
  const vehicleCarPictures = omit(gallery, [
    'three_quarters_front_picture',
    'front_picture',
    'left_side_picture',
    'right_side_picture',
    'back_picture',
    'trunk_picture',
    'three_quarters_front_right_picture',
    'three_quarters_back_left_picture',
    'three_quarters_back_picture',
  ]);
  return { ...listPictures, ...vehicleCarPictures };
}
