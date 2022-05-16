const router = require("express").Router();
const { checkAuthorization } = require("../controllers/authController");
const UserController = require("../controllers/userContoller");

router.get('/',checkAuthorization, UserController.getUserDataController);

router.put('/',checkAuthorization,UserController.updateUserDataController);

router.delete('/',checkAuthorization,UserController.deleteUserController); 

module.exports = router;