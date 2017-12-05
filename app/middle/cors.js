module.exports = function cors(req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization');

  next();
};
