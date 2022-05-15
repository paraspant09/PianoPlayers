const router = require("express").Router();
const UserController = require("../controllers/userContoller");

router.get('/', UserController.getAllUsersController);

router.get('/:id', UserController.getUserByIDController);

router.put('/',UserController.updateUserDataController);

router.delete('/:id',UserController.deleteUserController); 

module.exports = router;