module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: [
        "http://localhost",
        "http://localhost:3000",
        "https://ligaquiz.pt",
        "https://quiznations.quizportugal.pt",
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
