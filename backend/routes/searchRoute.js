const router = require("express").Router();
const SearchController = require("../controllers/searchController");

router.get('/artist/:name', SearchController.getArtistsBySearchController);

module.exports = router;