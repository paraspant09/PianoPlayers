const router = require("express").Router();
const SearchController = require("../controllers/searchController");

router.get('/artist/:name', SearchController.getArtistsBySearchController);

router.get('/song/:name', SearchController.getSongsBySearchController);

router.get('/playlist/:name', SearchController.getPlaylistsBySearchController);

module.exports = router;