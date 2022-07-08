import express from "express";
import * as IPFS from "ipfs-core";

const node = await IPFS.create({ repo: "repo/ok" + Math.random() });

const router = express.Router();

router.get("/cat/:cid", async (req, res, next) => {
  const cid = req.params.cid;
  let chunks = [];

  for await (const chunk of node.cat(cid)) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks);

  return res.send(data);
});

export default router;
