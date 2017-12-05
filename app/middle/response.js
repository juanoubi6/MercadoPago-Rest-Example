module.exports = function (req, res, next) {

  res.dispatch = function (status = 500, message = defaultMessage(status), content = null) {

    this.status(status)
      .json({
        message,
        content
      });
  };

  function defaultMessage(status) {
    switch (status) {
      case 200:
        return "";
      case 201:
        return "";
      case 400:
        return "Parameter invalid or missing";
      case 401:
        return "Unauthorized";
      case 403:
        return "Not allowed";
      case 404:
        return "Not found";
      case 429:
        return "Too many requests";
      case 500:
        return "Something went wrong";
      case 501:
        return "Not implemented";
    }
  }

  next();
};
