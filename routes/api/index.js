const express = require("express");
const contractRouter = require("./contract");

const router = express.Router();

router.use("/", contractRouter);

module.exports = router;
