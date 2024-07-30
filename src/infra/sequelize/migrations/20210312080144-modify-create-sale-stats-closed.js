'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`CREATE OR REPLACE
    ALGORITHM = UNDEFINED VIEW salesStats AS (
    select
        s1.id AS saleId,
        s2.secondsBeforeEnd AS secondsBeforeEnd,
        s2.secondsBeforeStart AS secondsBeforeStart,
        if((s1.validationStatus <> 'VALIDATED'),
        'INACTIVE',
        if((s2.secondsBeforeStart > 0),
        'SCHEDULED',
        if((s2.secondsBeforeEnd > 0),
        'LIVE',
        if((s2.secondsBeforeEnd > -((43200 * 1))),
        'CLOSED',
        if((s2.secondsBeforeEnd > -((86400 * 50))),
        'FINISHED',
        'ARCHIVED'))))) AS status
    from
        (sales s1
    left join (
        select
            sales.id AS id,
            sales.validationStatus AS validationStatus,
            (to_seconds(sales.endDateTime) - to_seconds(now())) AS secondsBeforeEnd,
            (to_seconds(sales.startDateTime) - to_seconds(now())) AS secondsBeforeStart
        from
            sales) s2 on
        ((s1.id = s2.id))))
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP VIEW  salesStats`);
  },
};
