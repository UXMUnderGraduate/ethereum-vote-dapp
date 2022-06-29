const express = require("express");
const fs = require("fs");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

let hash;
const candidates = ["Rama", "Nick", "Jose"].map((name) =>
  web3.utils.asciiToHex(name)
);

const bytecode = fs.readFileSync("./Voting_sol_Voting.bin").toString();
const abi = JSON.parse(fs.readFileSync("./Voting_sol_Voting.abi").toString());
const deployedContract = new web3.eth.Contract(abi);

web3.eth
  .getAccounts()
  .then((accounts) => {
    console.log(accounts);
    hash = accounts[0];
  })
  .then(() => {
    deployedContract
      .deploy({
        data: bytecode,
        arguments: [candidates],
      })
      .send({
        from: hash,
        gas: 1500000,
        gasPrice: web3.utils.toWei("0.00003", "ether"),
      })
      .then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address;
      });
  });

const router = express.Router();

router.get("/accounts", async (req, res, next) => {
  web3.eth.getAccounts((err, accs) => {
    if (err != null) {
      console.log("There was an error fetching accounts.");
      return res.json({ error: true });
    }

    if (accs.length === 0) {
      console.log(
        "Couldn't get any accounts! Make sure the Ethereum client is configured correctly."
      );
      return res.json({ error: true });
    }

    return res.json({ account: accs[0] });
  });
});

router.post("/total", async (req, res, next) => {
  const names = req.body["names[]"];
  console.log(names);

  const data = {};
  for (const name of names) {
    const count = await deployedContract.methods
      .totalVotesFor(web3.utils.asciiToHex(name))
      .call();
    data[name] = count;
  }

  return res.json(data);
});

router.post("/vote", async (req, res, next) => {
  const { name, from } = req.body;

  try {
    const result = await deployedContract.methods
      .voteForCandidate(web3.utils.asciiToHex(name))
      .send({ from });
    console.log(result);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).send();
  }
});

module.exports = router;
