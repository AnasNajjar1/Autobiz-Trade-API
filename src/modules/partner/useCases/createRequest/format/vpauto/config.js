const _ = require('lodash');

exports.key = '5956ed88587sv89hjdg98f812edlop25';
const urls = {
  dev: 'https://test.optimvo.fr',
  staging: 'https://test.optimvo.fr',
  prod: 'https://optimvo.fr',
};

exports.url = urls[process.env.stage];

const kermorvantPdv = {
  dev: [
    { id: 2079, name: 'AUTO EXPO' },
    { id: 3785, name: 'VANNES AUTO OUEST' },
    { id: 4446, name: 'KERLANN AUTOMOBILES' },
    { id: 2080, name: 'VENETE AUTOMOBILE' },
    { id: 24093, name: 'KERMORVANT AUTOMOBILES' },
    { id: 136565, name: 'EXCLUSIVE AUTOMOBILES' },
  ],
  staging: [
    { id: 2079, name: 'AUTO EXPO' },
    { id: 3785, name: 'VANNES AUTO OUEST' },
    { id: 4446, name: 'KERLANN AUTOMOBILES' },
    { id: 2080, name: 'VENETE AUTOMOBILE' },
    { id: 24093, name: 'KERMORVANT AUTOMOBILES' },
    { id: 136565, name: 'EXCLUSIVE AUTOMOBILES' },
  ],
  prod: [
    { id: 2079, name: 'AUTO EXPO' },
    { id: 2080, name: 'VENETE AUTOMOBILE' },
    { id: 3785, name: 'VANNES AUTO OUEST' },
    { id: 4446, name: 'KERLANN AUTOMOBILES' },
    { id: 24224, name: 'LORIENT AUTO OUEST' },
    { id: 24093, name: 'KERMORVANT AUTOMOBILES' },
    { id: 136565, name: 'EXCLUSIVE AUTOMOBILES' },
    { id: 164169, name: 'K&GO VANNES' },
    { id: 194488, name: 'AUTO EXPO SUZUKI' },
  ],
};

const EasyRepriseMail = {
  dev: 'b.chandon@autobiz.com',
  staging: 'b.chandon@autobiz.com',
  prod: 'managementER@autobiz.com',
};

const KermorvantMail = {
  dev: 'b.chandon@autobiz.com',
  staging: 'b.chandon@autobiz.com',
  prod: 'franck.kermorvant@morbihan-auto.com',
};

exports.emailUsers = function (autobizPosId, name) {
  const stage = process.env.stage;
  return _.filter(
    kermorvantPdv[stage],
    (pdv) => pdv.id === autobizPosId || pdv.name === name,
  ).length > 0
    ? KermorvantMail[stage]
    : EasyRepriseMail[stage];
};
