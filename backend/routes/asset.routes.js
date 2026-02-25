const express = require("express");
const { getAsset } = require("../controllers/asset.controller");

const router = express.Router();

router.get("/:key", getAsset);

module.exports = router;

