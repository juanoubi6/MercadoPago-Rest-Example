module.exports = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  WEB_MEMORY: process.env.WEB_MEMORY,
  WEB_CONCURRENCY: process.env.WEB_CONCURRENCY || 1,
  JWT_SECRET: process.env.JWT_SECRET,

  MP_CLIENT_ID: "",
  MP_CLIENT_SECRET: "",
  MP_ACCESS_TOKEN: "",
  MP_SANDBOX: "true"
};
