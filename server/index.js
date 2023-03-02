const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const {  utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak')
require('dotenv').config();



app.use(cors());
app.use(express.json());

const balances = {
  "0x6adcd094e456cc801e0618763c7d12e361484381": 100,
  "0x7445ed1819c084d0544b51f2364526102a789c1d": 50,
  "0x9f2d25540877f90be34e74641fe13a315460003b": 75,
};

const privateKeys = {
  "0e0d53a7dd1fa301a64a146d81abb2fd8ecc4e0d792fe63c1083d9c15b2c1d9f": "04d8da2590848e336b70a43577f8fca536a5a5080aedf784d8dc3bbd051431ecc3efb2f1b378348a001e8ecb293ef764e136c5e36e861f0bf1f945578a7cc70b27",
  "0220c1970d70d6fd233956dd0d233083ec84acb208ff524fc0951a733a516069": "0472d069aa4a76f70c118f91519bf3c195575f2c2e0fb98db65a1940249443d295bb890e190c394f3a8fa97ada24bdf4b3f9f3ae9c49c593215a081b13be3aae6c",
  "4c36fce6c0d24b0f3c6552810a40b680786102c3225473db0df47a63d9d753b0": "04ed2922eb799b46d07ba64816583943caf90678eca9b47057442626441ec2e931ade6e0a28d092571214796edc8bc587d4a48fdf1238fb7aae4c16a6a0e04bb64"
}

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = "0472d069aa4a76f70c118f91519bf3c195575f2c2e0fb98db65a1940249443d295bb890e190c394f3a8fa97ada24bdf4b3f9f3ae9c49c593215a081b13be3aae6c"

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  
    const { sender, recipient, amount } = req.body;
    console.log(req.body);

    const message = `${sender}${recipient}${amount}`;
    console.log(message);

    const messageHash = keccak256(Buffer.from(JSON.stringify(message), 'utf8'));
    const msgHsh = toHex(messageHash)
    console.log('messageHash:', msgHsh);
  

    // sign the recovery key
    
      const signatureArray = await secp.sign(msgHsh, PRIVATE_KEY, {recovered: true});
      const signature = toHex(signatureArray[0]);
      console.log('signature', signature);
      const recoveryBit = signatureArray[1];
    
    // recover public key
    const signaturePublicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);
    console.log(signaturePublicKey);

    const signaturePublicKeyToHex = toHex(signaturePublicKey);
    console.log(signaturePublicKeyToHex);
 

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (signaturePublicKeyToHex !== PUBLIC_KEY) {
      res.status(400).send({message: "You are not the person!"}) 
      return;
    
    } else {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
        return;
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    }  
   
});


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
