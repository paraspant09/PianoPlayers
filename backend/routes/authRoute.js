const router = require("express").Router();
const AuthController = require("../controllers/authController");

router.post('/register',AuthController.registerController);

router.post('/login',AuthController.loginController);

router.post('/logout',AuthController.checkAuthorization, AuthController.logoutController);

module.exports = router;