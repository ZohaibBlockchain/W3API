import {
  userExits,
  UpdateUserWallet,
  getUserInstrumentSettings,
  AddNewUser,
  registerTrade,
  createDefaultIcon,
  checkWalletExistence,
  UpdateUserData,
} from "../db/db";
import express from "express";
export const router = express.Router();
import { getNames, checkType, detectInstrument } from "../../helperFx";

import {
  getInstrument,
} from "../web3";
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());
router.use(express.urlencoded());
const defaultTokenUri = "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/Basic-Attention-Token-icon.png";


router.get("/", (req, res) => {
  res.send("Welcome to W3 REST API!!!");
});





router.post("/tokendetails", async (req, res) => {


  //requirement Symbol and walletAddress,Type
  try {
    let inf = req.body;
    if (!checkType(inf.symbol))//For Cash Instruments...
    {

      res.status(200).send({ token: '0x999', tokenDecimal: '6', tokenIcon: 'Null' });

    }
    else {//CFD Instruments


      let userCount = await userExits(inf.walletAddress);

      if (userCount > 0) {

        let userInf = await getUserInstrumentSettings(inf.walletAddress);


        let instrumentDetails = detectInstrument(inf.symbol);

        let data = { instrumentName: inf.symbol, tokenSymbol: instrumentDetails.name, instrumentType: instrumentDetails.type };
        let r = await getInstrument(data);
        let update = await updateTokenInfo(userInf.Instruments, inf.symbol, userInf._id);


        if (update.value == 'Buy') {
          let tokenDetails = { TokenSymbol: instrumentDetails.name + '.L', TokenAddress: r[0], TokenDecimal: '6', Icon: defaultTokenUri }
          res.status(200).send(tokenDetails);
          return;
        } else {
          let tokenDetails = { TokenSymbol: instrumentDetails.name + '.S', TokenAddress: r[1], TokenDecimal: '6', Icon: defaultTokenUri }
          res.status(200).send(tokenDetails);
          return;
        }
      }
      else {
        let obj = []; //Initialize with empty Array...
        let createUser = await AddNewUser({ wallet: inf.walletAddress, instruments: obj });

        if (createUser) {
          let userInf = await getUserInstrumentSettings(inf.walletAddress);
          let update = await updateTokenInfo(userInf.Instruments, inf.symbol, userInf._id);


          let instrumentDetails = detectInstrument(inf.symbol);
          let data = { instrumentName: inf.symbol, tokenSymbol: instrumentDetails.name, instrumentType: instrumentDetails.type };
          console.log(data);
          let r = await getInstrument(data);

          if (update.value == 'Buy') {
            let tokenDetails = { TokenSymbol: instrumentDetails.name + '.L', TokenAddress: r[0], TokenDecimal: '6', Icon: defaultTokenUri }
            res.status(200).send(tokenDetails);
            return;
          } else {
            let tokenDetails = { TokenSymbol: instrumentDetails.name + '.S', TokenAddress: r[1], TokenDecimal: '6', Icon: defaultTokenUri }
            res.status(200).send(tokenDetails);
            return;
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send('unexpected error TD1');
  }
  res.status(400).send('unexpected error TD2');
});


async function updateTokenInfo(arr, symbol, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].Name == symbol) {
      let previousValue = arr[i].value;
      arr[i].value = flipValue(previousValue);
      let update = await UpdateUserData(arr, id);
      return { report: update, value: previousValue };
    }
  }
  let obj = { Name: symbol, value: 'Sell' };
  arr.push(obj);
  let update = await UpdateUserData(arr, id);
  return { report: update, value: 'Buy' };
}

function flipValue(val) {
  if (val == 'Buy')
    return 'Sell';
  else {
    return 'Buy';
  }
}


router.post("/tradeUpdate", async (req, res) => {
  try {

    console.log(req.body);
    let InfArray = [];
    InfArray.push(req.body.Message);
    let Data = getNames(InfArray)[0];
    let trade = await registerTrade({
      walletAddress: Data.fullInfo.PartyID,
      tokenAmount: Data.fullInfo.OrderQty,
      tokenSymbol: Data.Symbol,
      instrumentType: Data.type,
      instrumentName: Data.Name,
      side: Data.fullInfo.Side,
      contractMultiplier: Data.fullInfo.ContractMultiplier,
      orderID: Data.fullInfo.OrderID,
      execID: Data.fullInfo.ExecID,
    });
    if (trade.result === 'Unique') {

      res.status(200).send({ status: "Successfully Submitted" });
    }
    else if (trade.result === 'Already exits') {
      res.status(400).send({ status: "Order already exits" });
    }
    else if (trade.result === 'error') {
      res.status(400).send({ status: "Failed to Execute 0x001" });
    }
  } catch (error) {
    res.status(400).send({ status: "Failed to Execute 0x002",e:error.message });
  }
});


router.get("*", function (req, res) {
  res.send("Invalid request", 404);
});

router.post("*", function (req, res) {
  res.send("Invalid request", 404);
});




