const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const secp = require('ethereum-cryptography/secp256k1');


(async () => {
    const PRIVATE_KEY = '0e0d53a7dd1fa301a64a146d81abb2fd8ecc4e0d792fe63c1083d9c15b2c1d9f';
    let message = {
        from: '0x6adcd094e456cc801e0618763c7d12e361484381',
        to: '0x9f2d25540877f90be34e74641fe13a315460003b',
        amount: 10,
    };
    console.log("Message:", message);

    const messageHash = keccak256(Buffer.from(JSON.stringify(message), 'utf8'));
    console.log('Hashed Message:', messageHash.toString('hex'));
    
    // Sign the message using the private key
    const [signature, recoveryBit] = await secp.sign(messageHash, PRIVATE_KEY, {recovered: true}); 
    console.log('Signature:', signature.toString('hex'));
    console.log('Recovery Bit:', recoveryBit);
    
    

})();





