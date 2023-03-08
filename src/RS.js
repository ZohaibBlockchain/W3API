//Beta version 1.1 of W3API...

import express from "express";
const bodyParser = require("body-parser");
import {ExeTrade} from "./db/db";
const mongoose = require("mongoose");
require("dotenv").config();
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
        w3Engine();
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
  console.log("...");
});

process.on('TypeError', function (err) {
  console.error(err);
  console.log("...");
});


//-----------fuctions--------
const updateSpeed = 1000;
async function w3Engine() {
  let c = await ExeTrade();
  console.log(c);
  setTimeout(() => { w3Engine(); }, updateSpeed);
}
//---------fuctions--------
//---------ExecutionBlock------
//---------ExecutionBlock------
//
