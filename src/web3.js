import "ethers";
import { ethers } from "ethers";
const fContractInfo = require("./contractABI/factory.json");
const tContractInfo = require("./contractABI/CAtoken.json");
require('dotenv').config();

const account_from = {
  privateKey:
    process.env.PK,
};



const providerRPC = {
  bscTestnet: {
    name: "bscTestnet",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545", // Insert your RPC URL here
    chainId: 97, //0x in hex,
  },
};
// 3. Create ethers provider
const provider = new ethers.providers.StaticJsonRpcProvider(
  providerRPC.bscTestnet.rpc,
  {
    chainId: providerRPC.bscTestnet.chainId,
    name: providerRPC.bscTestnet.name,
  }
);


async function userValidation(message, signedMessage) {
  const signerAddress = ethers.utils.verifyMessage(message, signedMessage);

  const addressFromMessage = message.replace(/\n|\r/g, "").split("Wallet address:").pop().split("Nonce:")[0].trim();

  // const nonce = message.split("Nonce:").pop().trim();
  let addr = JSON.parse(addressFromMessage);

  const msgAddress = ethers.utils.getAddress(addr.walletaddress);
  if (signerAddress !== msgAddress) {
    return false;
  }
  else {
    return true;
  }
}



async function getTokenAddress(name,instrumentType)
{
  const pk = account_from.privateKey.toString();
  let wallet = new ethers.Wallet(pk, provider);
  if (fContractInfo.factoryAddress) {
    let contract = new ethers.Contract(
      fContractInfo.factoryAddress,
      fContractInfo.factoryABI,
      wallet
    );
    return await contract.getAddressByName(name,instrumentType);
  }else{
    return null;
  }
}




async function createNewToken(name, symbol, decimal,instrumentType) {
  const pk = account_from.privateKey.toString();
  let wallet = new ethers.Wallet(pk, provider);
  if (fContractInfo.factoryAddress) {
    let contract = new ethers.Contract(
      fContractInfo.factoryAddress,
      fContractInfo.factoryABI,
      wallet
    );
    let deployTokenRes = await contract.deployNewERC20Token(
      name,
      symbol,
      decimal,
      instrumentType
    );
    let res = await provider.waitForTransaction(deployTokenRes.hash, 1, 300000);
    console.log(res);
    return res;
  }
}


async function burnTokens(name, amount, userAddress) {
  if (userAddress !== undefined) {
    let wallet = new ethers.Wallet(account_from.privateKey, provider);

    console.log(userAddress);
    if (fContractInfo.factoryAddress) {
      let contract = new ethers.Contract(
        fContractInfo.factoryAddress,
        fContractInfo.factoryABI,
        wallet
      );
      let res = await contract.getAddressByName(name);
      if (res) {
        console.log(res);
        let tokenContract = new ethers.Contract(
          res,
          tContractInfo.tokenABI,
          wallet
        );
        let _res = await tokenContract.decimal();
        const gweiValue = ethers.utils.parseUnits(
          amount.toString(),
          _res.toNumber()
        );
        console.log(gweiValue);
        let burnTokenRes = await tokenContract.burn(
          userAddress.toString(),
          gweiValue
        );
        let __res = await provider.waitForTransaction(
          burnTokenRes.hash,
          1,
          300000
        );
        console.log(__res);
      } else {
        console.log("!No address found");
      }
    }
  }
}



async function mintNewToken(name, amount,userAddress) {
 console.log(userAddress);
  if (userAddress !== undefined) {
    let wallet = new ethers.Wallet(account_from.privateKey, provider);
    if (fContractInfo.factoryAddress) {
      let contract = new ethers.Contract(
        fContractInfo.factoryAddress,
        fContractInfo.factoryABI,
        wallet
      );
      let res = await contract.getAddressByName(name);
      if (res) {
        console.log(res);
        let tokenContract = new ethers.Contract(
          res,
          tContractInfo.tokenABI,
          wallet
        );
        let _res = await tokenContract.decimal();
        const gweiValue = ethers.utils.parseUnits(
          amount.toString(),
          _res.toNumber()
        );
        console.log(gweiValue);
        let mintTokenRes = await tokenContract.mint(
          userAddress.toString(),
          gweiValue
        );
        let __res = await provider.waitForTransaction(
          mintTokenRes.hash,
          1,
          300000
        );
        console.log(__res);
      } else {
        console.log("!No address found");
      }
    }
  }
}

async function createNewAndMint(name,symbol,amount,decimal,userAddress,instrumentType) {
  createNewToken(name, symbol, decimal,instrumentType)
    .then((value) => {
    return  mintNewToken(name, amount, userAddress);
    });
}












export {
  createNewToken,
  mintNewToken,
  burnTokens,
  userValidation,
  getTokenAddress,
  createNewAndMint,
};


