"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  "0 12 * * 3-6": async () => {
    const games = await strapi.services.games.find({ datetime_null: true });
    games.forEach((game) => {
      game.teams.forEach(async (team) => {
        if (team.captain_email) {
          await strapi.plugins.email.services.email.send({
            to: team.captain_email,
            subject: "[Quiz Nations] Jogo por agendar",
            html: `
              Olá!<br/>
              <br/>
              A tua equipa tem um jogo por agendar.<br/>
              Pedimos que o faças através do seguinte endereço:<br/>
              <a href="https://ligaquiz.pt/quiz-nations/${team.token}" target="_blank">https://ligaquiz.pt/quiz-nations/${team.token}</a><br/>
              <br/>
              Obrigado,<br/>
              Quiz Portugal
            `,
          });
        }
      });
    });
  },
};
