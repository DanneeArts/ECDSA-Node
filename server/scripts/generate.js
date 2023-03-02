const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak')

// generating private key
const privateKey = secp.utils.randomPrivateKey();
console.log('private key:', toHex(privateKey));

// generating public key from private key
const publicKey = secp.getPublicKey(privateKey);
console.log('public key:', toHex(publicKey));

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log(`ethereum address: 0x${toHex(address)}`);
