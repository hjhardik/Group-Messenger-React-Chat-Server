const { Router } = require('express');
const authController = require('../controllers/auth');

// look at the Routes primer section in https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
// specifies the working and advantages of express router over direct routing
const authRouter = new Router();

authRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  authController
    .signUp(username, password)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        exists: result.exists,
        user: result.user,
        token: result.token,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

authRouter.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  authController
    .login(username, password)
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
        notExists: result.notExists,
        user: result.user,
        token: result.token,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

authRouter.get('/logout', (req, res, next) => {
  authController
    .logout()
    .then((result) => {
      res.json({
        success: result.success,
        message: result.message,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error.message,
      });
      next(error);
    });
});

module.exports = authRouter;
