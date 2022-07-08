import express from "express";
import contractRouter from "./contract.js";
import fileRouter from "./file.js";

const router = express.Router();

router.use("/contract", contractRouter);
router.use("/file", fileRouter);

export default router;
