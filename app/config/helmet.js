module.exports = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  },
  dnsPrefetchControl: false,
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: false
};
