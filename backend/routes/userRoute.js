const router = require("express").Router();
const { checkAuthorization } = require("../controllers/authController");
const UserController = require("../controllers/userContoller");

router.get('/',checkAuthorization, UserController.getUserDataController);

router.put('/',checkAuthorization,UserController.updateUserDataController);

router.delete('/',checkAuthorization,UserController.deleteUserController); 


// /user/song

router.get('/song/',checkAuthorization, UserController.getUserSongsController);

router.post('/song/',checkAuthorization, UserController.createNewSongController);

router.put('/song/',checkAuthorization, UserController.updateUserSongDataController);

router.delete('/song/',checkAuthorization,UserController.deleteASongController); 

// /user/playlist

router.get('/playlist/',checkAuthorization, UserController.getUserPlaylistsController);

router.post('/playlist/',checkAuthorization, UserController.createNewPlaylistController);

router.put('/playlist/',checkAuthorization, UserController.updateUserPlaylistDataController);

router.delete('/playlist/',checkAuthorization,UserController.deleteAPlaylistController); 

// /user/like/artist

router.get('/like/artist/',checkAuthorization, UserController.getAllArtistsLikedByAUserController);

router.post('/like/artist/',checkAuthorization, UserController.addNewUserWhoLikedAnArtistController);

router.delete('/like/artist/',checkAuthorization,UserController.deleteUserWhoLikedAnArtistController); 

// /user/like/song

router.get('/like/song/',checkAuthorization, UserController.getAllSongsLikedByAUserController);

router.post('/like/song/',checkAuthorization, UserController.addNewUserWhoLikedASongController);

router.delete('/like/song/',checkAuthorization,UserController.deleteUserWhoLikedASongController);

// /user/add/playlist

router.get('/add/playlist/',checkAuthorization, UserController.getAllPlaylistsAddedByAUserController);

router.post('/add/playlist/',checkAuthorization, UserController.addNewUserWhoAddedAPlaylistController);

router.delete('/add/playlist/',checkAuthorization,UserController.deleteUserWhoAddedAPlaylistController); 

// /user/add/song

router.post('/add/song/',checkAuthorization, UserController.addNewSongInAPlaylistController);

router.delete('/add/song/',checkAuthorization,UserController.deleteSongFromAPlaylistController); 

module.exports = router;