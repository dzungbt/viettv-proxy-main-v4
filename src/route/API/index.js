const express = require("express");

const userRoutes = require('./user');
const router = express.Router({ mergeParams: true });

router.use(express.json());

router.use("/user", userRoutes);

module.exports = router;
