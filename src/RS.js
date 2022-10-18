//Beta version 1.1 of W3API...

import express from "express";
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
require("dotenv").config();
import {
  createNewToken,
  userValidation,
  getTokenAddress,
  createNewAndMint,
  mintNewToken,
  burnTokens,
} from "./web3";
import { router } from "./routes/routes";

const decimal = 6;
const ip = require("ip");
const ipAddress = ip.address();









const mongoDB = process.env.DBKEY.toString();
mongoose
  .connect(process.env.DBKEY, { useNewUrlParser: true })
  .then(() => {
    //-----------Express----------
    const envport = process.env.SERVERPORT;
    var app = express();

 
    app.use(router);
    app
      .listen(envport, function () {
        console.log(`The SERVER HAS STARTED ON PORT: ${envport}`);
        console.log(ipAddress);
      })

      .on("error", function (err) {
        console.log(err);
        process.once("SIGUSR2", function () {
          process.kill(process.pid, "SIGUSR2");
        });
        process.on("SIGINT", function () {
          // this is only called on ctrl+c, not restart
          process.kill(process.pid, "SIGINT");
        });
      });

    //-----------Express----------
  });






  process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
  });

  process.on('TypeError', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
  });









//-----------fuctions--------

async function updateTokens(info) {
  //Create and mint
  try {
    let address = await getTokenAddress(info.name, info.instrumentType);

    if (address.toString() != "0x0000000000000000000000000000000000000000") {
      //already exits
      if (info.type == "buy") {
        mintNewToken(info.name, info.amount, info.walletAddress);
      } else {
        //sell
        burnTokens(info.name, info.amount, info.walletAddress);
      }
    } else {
      return await createNewAndMint(
        info.name,
        info.symbol,
        info.amount,
        decimal,
        info.walletAddress,
        info.instrumentType
      );
    }
  } catch (error) {
    console.log(error);
  }
}

const updateSpeed = 3000;

async function w3Engine() {
  let count = await checkCount("trades");
  if (count > 0) {
    let doc = await getDocument("trades");
    let res = await updateTokens({
      name: doc.tokenName,
      instrumentType: doc.instrumentType,
      symbol: doc.tokenSymbol,
      amount: doc.tokenAmount,
      walletAddress: doc.walletAddress,
    });
    if (res.confirmation > 0) {
      //doc update in db as completed...
      //run Engine Again...
    } else {
    }
  } else {
    console.log("Hellow Dev!");
  }
  setTimeout(() => {
    w3Engine();
  }, updateSpeed);
}
//---------fuctions--------

//---------ExecutionBlock------

//---------ExecutionBlock------

//
