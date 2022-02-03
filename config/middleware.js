module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost:1337",
        "http://localhost:3000",
        "https://ligaquiz.pt",
        "https://quiznations.quizportugal.pt",
        "https://pororoca.quizportugal.pt",
      ],
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "X-Requested-With",
      ],
    },
  },
};
