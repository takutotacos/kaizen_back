let User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = basicAuth;

async function basicAuth(req, res, next) {
  // make login path public
  if (req.path === '/users' || req.path === '/users/login') {
    return next();
  }

  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({message: 'Missing Authorization Headers'});
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');
  if (!email || !password) {
    return res.status(401).json({message: 'Invalid Authentication Credentials'});
  }

  User.findOne({email: email}, (err, user) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (err || !res) {
        return res.status(401).json({message: 'Invalid Authentication Credentials'});
      }

      req.user = user;
      next();
    })
  });
}