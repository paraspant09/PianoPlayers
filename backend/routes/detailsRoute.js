const router = require("express").Router();
const DetailsController = require("../controllers/detailsController");

router.get('/like/artist/:id', DetailsController.getLikesOfArtistController);

router.get('/like/song/:id', DetailsController.getLikesOfSongController);

router.get('/add/playlist/:id', DetailsController.getAddsToLibraryOfPlaylistController);

router.get('/add/song/:id', DetailsController.getAllSongsOfAPlaylistController);

module.exports = router;