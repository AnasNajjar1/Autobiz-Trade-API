const ccMail = {
  dev: ['b.guimbert@autobiz.com'],
  staging: ['b.guimbert@autobiz.com'],
  prod: [
    'm.climent@autobiz.com',
    'n.halabi@autobiz.com',
    'a.fuentes@autobiz.com',
    'm.benitez@autobiz.com',
  ],
};
export const CCmail = ccMail[process.env.stage];
