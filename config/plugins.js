module.exports = ({ env }) => {
  let email;
  if (env("ENVIRONMENT") === "production") {
    email = {
      provider: "smtp",
      providerOptions: {
        host: "smtp.mailgun.org",
        port: 25,
        secure: true,
        username: env("MAILGUN_USER", ""),
        password: env("MAILGUN_PASSWORD", ""),
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 1,
      },
      settings: {
        from: "no-reply@quizportugal.pt",
        defaultFrom: "no-reply@quizportugal.pt",
      },
    };
  } else {
    email = {
      provider: "mailtrap",
      providerOptions: {
        user: env("MAILTRAP_USER", "default_user"),
        password: env("MAILTRAP_PASSWORD", "default_pass"),
      },
      settings: {
        defaultFrom: "no-reply@quizportugal.pt",
      },
    };
  }
  return {
    email,
  };
};
