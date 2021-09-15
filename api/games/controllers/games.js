"use strict";

const { sanitizeEntity } = require("strapi-utils");

const masterToken = process.env.MASTER_TOKEN;

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
    if (token === masterToken) {
      validToken = true;
    }
    if (validToken) {
      entity = await strapi.services.games.update({ id }, ctx.request.body);
      await strapi.plugins.email.services.email.send({
        to: [
          entity.teams[0].captain_email,
          entity.teams[1].captain_email,
          entity.host_email,
        ],
        subject: "[Quiz Nations] Jogo agendado",
        html: `
          Olá!<br/>
          <br/>
          O jogo entre ${entity.teams[0].name} e ${
          entity.teams[1].name
        } está agendado com os seguintes dados:<br/>
          <br/>
          Data: ${new Date(entity.datetime).toLocaleDateString("pt", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}<br/>
          Hora: ${new Date(entity.datetime).toLocaleTimeString("pt", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}<br/>
          Apresentador: ${entity.host_name}<br/>
          <br/>
          Os capitães receberão os tópicos via e-mail 10 minutos antes da hora do jogo.<br/>
          O apresentador receberá, pela mesma via e à mesma hora, as perguntas do jogo.<br/>
          <br/>
          Obrigado,<br/>
          Quiz Portugal
        `,
      });
      return sanitizeEntity(entity, { model: strapi.models.games });
    }
    return ctx.throw(403, "invalid_token");
  },
};
