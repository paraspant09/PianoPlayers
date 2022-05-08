const router = require("express").Router();
const userContoller = require("../controllers/userContoller");

router.get('/', userContoller.getAllUsersController);

router.post('/',userContoller.addNewUserController);

router.put('/',userContoller.updateUserDataController);

router.delete('/:id',userContoller.deleteUserController); 

module.exports = router;