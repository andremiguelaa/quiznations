module.exports = ({ env }) => {
  let email;
  if (env("ENVIRONMENT") === "production") {
    email = {
      provider: "mailgun",
      providerOptions: {
        apiKey: env("MAILGUN_API_KEY"),
        domain: env("MAILGUN_DOMAIN"),
        host: env("MAILGUN_HOST", "api.mailgun.net"),
      },
      settings: {
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
