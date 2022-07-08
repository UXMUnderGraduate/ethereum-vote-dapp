import express from "express";
import fs from "fs";
import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

let defaultAccount;
let electionInstance;

const bytecode = fs.readFileSync("./Election_sol_Election.bin").toString();
const abi = JSON.parse(
  fs.readFileSync("./Election_sol_Election.abi").toString()
);
const deployedContract = new web3.eth.Contract(abi);
web3.eth
  .getAccounts()
  .then((accounts) => {
    console.log(accounts);

    // Ethereum account for contract deployment
    defaultAccount = accounts[0];
  })
  .then(async () => {
    await deployedContract
      .deploy({
        data: bytecode,
        arguments: [],
      })
      .send(
        {
          from: defaultAccount,
          gas: 1000000,
          gasPrice: web3.utils.toWei("0.000001", "ether"),
        },
        (_err, trasactionHash) => {
          console.log(`Transaction Hash: ${trasactionHash}`);
        }
      )
      .on("error", (err) => {
        console.error(err);
      })
      .on("receipt", (receipt) => {
        console.log(`Contract Receipt: ${receipt.contractAddress}`);
      })
      .on("confirmation", (_confirmationNumber, _receipt) => {})
      .then((newContractInstance) => {
        electionInstance = newContractInstance;
        console.log(
          `Deployed Contract Address: ${newContractInstance.options.address}`
        );
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

router.get("/candidates", async (req, res, next) => {});

router.post("/total", async (req, res, next) => {
  const ids = req.body["ids[]"];
  console.log(ids);

  const data = {};
  for (const id of ids) {
    await electionInstance.methods
      .candidates(id)
      .call()
      .then((candidate) => {
        const voteCount = candidate[2];
        const image = candidate[3];

        data[id] = { id, voteCount, image };
      });
  }

  return res.json(data);
});

router.post("/vote", async (req, res, next) => {
  const { id, from } = req.body;

  console.log(req.body);

  try {
    const result = await electionInstance.methods.vote(id).send({ from });
    console.log(result);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).send();
  }
});

export default router;
