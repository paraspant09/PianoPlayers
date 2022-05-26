const router = require("express").Router();
const DetailsController = require("../controllers/detailsController");

router.get('/user/:uid', DetailsController.getUserDetailsController);

router.get('/song/:sid', DetailsController.getSongDetailsController);

router.get('/playlist/:pid', DetailsController.getPlaylistDetailsController);

router.get('/songs/:uid', DetailsController.getSongsOfAUserController);

router.get('/playlists/:uid', DetailsController.getPlaylistsOfAUserController);

//liked
router.get('/liked/artist/:id', DetailsController.getLikesOfArtistController);

router.get('/liked/song/:id', DetailsController.getLikesOfSongController);

router.get('/added/playlist/:id', DetailsController.getAddsToLibraryOfPlaylistController);

//all
router.get('/all/songs/:pid', DetailsController.getAllSongsOfAPlaylistController);

router.get('/all/playlists/:sid', DetailsController.getAllPlaylistsContainingASongController);


module.exports = router;