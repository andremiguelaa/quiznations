"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  update: async (ctx) => {
    const { id } = ctx.params;
    let entity = await strapi.services.games.findOne({ id });
    const token = ctx.request.body.token;
    let validToken = false;
    entity.teams.forEach((team) => {
      if (team.token === token) {
        validToken = true;
      }
    });
    if (validToken) {
      entity = await strapi.services.games.update({ id }, ctx.request.body);
      return sanitizeEntity(entity, { model: strapi.models.games });
    }
    return ctx.throw(403, 'invalid_token');
  },
};
