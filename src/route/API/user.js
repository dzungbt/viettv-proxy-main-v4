const express = require("express");

const router = express.Router({ mergeParams: true });
router.use(express.json());




module.exports = router;
