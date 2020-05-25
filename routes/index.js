const express = require("express");
const router = express.Router();
const getResults = require("../util/scraper");
//const getdata = require("../down");
const stdown = require("../controller/downn.js");
/* GET home page. */
router.get("/", async function(req, res, next) {
  const result = await getResults();
  res.render("index", result);
  //getdata();
  stdown();
});
module.exports = router;
