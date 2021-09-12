"use strict";

const marked = require("marked");

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
  "0 12 * * 1-6": async () => {
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
  "* * * * *": async () => {
    const inTenMinutes = new Date(new Date().getTime() + 10 * 60000);
    const games = await strapi.services.games.find({
      datetime_lt: inTenMinutes,
      quiz_sent: false,
    });
    games.forEach(async (game) => {
      const quiz = await strapi.services.quizzes.findOne({
        round: game.round,
        tier: game.teams[0].tier,
      });
      if (quiz) {
        game.teams.forEach(async (team) => {
          if (team.captain_email) {
            await strapi.plugins.email.services.email.send({
              to: team.captain_email,
              subject: "[Quiz Nations] Jogo",
              html: `
                Olá!<br/>
                <br/>
                O teu jogo começa daqui a 10 minutos.<br/>
                Os tópicos do jogo são os seguintes:<br/>
                <br/>
                ${marked(quiz.topics)}
                <br/>
                <br/>
                Boa sorte,<br/>
                Quiz Portugal
              `,
            });
          }
        });
        if (game.host_email) {
          await strapi.plugins.email.services.email.send({
            to: game.host_email,
            subject: "[Quiz Nations] Jogo",
            html: `
            Olá!<br/>
            <br/>
            O jogo que vais apresentar começa daqui a 10 minutos.<br/>
            Os tópicos do jogo são os seguintes:<br/>
            <br/>
            ${marked(quiz.topics)}
            <br/>
            <br/>
            Podes fazer o download do ficheiro com as perguntas <a href="https://quiznations.quizportugal.pt${
              quiz.questions.url
            }" target="_blank">aqui</a>.<br/>
            <br/>
            Boa sorte,<br/>
            Quiz Portugal
          `,
          });
        }
        await strapi.services.games.update(
          { id: game.id },
          { quiz_sent: true }
        );
      }
    });
  },
};
