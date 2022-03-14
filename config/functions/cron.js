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
  "0 12 * * *": async () => {
    const games = await strapi.services.games.find({ datetime_null: true });
    games.forEach((game) => {
      game.teams.forEach(async (team, index) => {
        if (team.captain_email) {
          const opponent = index === 1 ? game.teams[0] : game.teams[1];
          await strapi.plugins.email.services.email.send({
            to: team.captain_email,
            subject: "[Quiz Nations] Jogo por agendar",
            html: `
              Olá!<br/>
              <br/>
              A tua equipa tem um jogo por agendar.<br/>
              <br/>
              Equipa adversária: ${opponent.name}<br/>
              Capitão: ${opponent.captain_name} ${
              opponent.captain_email
                ? `(<a href="mailto:${opponent.captain_email}" target="_blank">${opponent.captain_email}</a>)`
                : ""
            }<br/>
              <br/>
              Pedimos que o faças através do seguinte endereço:<br/>
              <a href="https://ligaquiz.pt/quiz-nations/${
                team.token
              }" target="_blank">https://ligaquiz.pt/quiz-nations/${
              team.token
            }</a><br/>
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
                Sala para o jogo: <a href="https://videoconf-colibri.zoom.us/j/${
                  game.room
                }" target="_blank">https://videoconf-colibri.zoom.us/j/${
                game.room
              }</a><br/>
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
            Para marcar as pontuações e aceder às perguntas deves usar este link: <a href="https://pororoca.quizportugal.pt/?game=${
              game.score
            }&questions=https://quiznations.quizportugal.pt${
              quiz.questions.url
            }">https://pororoca.quizportugal.pt/?game=${
              game.score
            }&questions=https://quiznations.quizportugal.pt${
              quiz.questions.url
            }</a><br/>
            <br/>
            Sala para o jogo: <a href="https://videoconf-colibri.zoom.us/j/${
              game.room
            }" target="_blank">https://videoconf-colibri.zoom.us/j/${
              game.room
            }</a><br/>
            <br/>
            Alternativamente podes fazer o download do ficheiro com as perguntas <a href="https://quiznations.quizportugal.pt${
              quiz.questions.url
            }" target="_blank">aqui</a> e marcar a pontuação: <a href="${
              game.score
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
