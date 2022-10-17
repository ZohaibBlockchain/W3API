import e from 'express';
import express from 'express';
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
import { UserModel, TokenModel, TradeModel } from '../schemas';
require('dotenv').config();
import { createNewToken, userValidation, getTokenAddress, createNewAndMint, mintNewToken, burnTokens } from './web3';
const decimal = 6;
const ip = require('ip');
const ipAddress = ip.address();


let x = mongoose.Types.ObjectId('634964f21afadb8df07b3293');

//-----------MongoDB----------
const mongoDB = process.env.DBKEY.toString();
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
//-----------MongoDB----------



//---------DBFunction----------
async function getUserWallet(_userUId) {
  let x = await UserModel.find({ "userUId": _userUId });

  if (x.length > 0) {
    console.log(x[0].userWallet);
    return true;
  } else {
    console.log('N?A');
    return false;
  }
}



async function checkCount(collectionName) {
  let col = db.collection(collectionName);
  const count = await col.countDocuments()
  console.log(count);
  return count;
}

async function getDocument(collectionName) {
  let col = db.collection(collectionName);
  return await col.findOne({ completed: false });
}

async function deleteDocument(collectionName, id) {
  let col = db.collection(collectionName);
  return await col.deleteOne({ _id: id });
}


async function updateDocument(args) {
  let col = db.collection(args.collectionName);
  console.log(col.name);
  return await col.findOneAndUpdate({_id:x},{$set:{transactionHash:args.transactionHash}});
}

async function AddNewUser(userData) {
  const NewUser = new UserModel({ userUId: userData.uid, userWallet: userData.wallet });
  NewUser.save().then(() => {
    console.log('New User Added');
    return true;
  });
}


async function registerTrade(info) {
  const newTrade = new TradeModel({ userId: info.uid, walletAddress: info.walletAddress, tokenAmount: info.tokenAmount, tokenName: info.tokenName, instrumentType: info.instrumentType, completed: false,tokenSymbol:info.tokenSymbol,transactionHash:""});
  newTrade.save().then(() => {
    console.log('New Trade Added');
    return true;
  });
}


//---------DBFunction----------








//-----------Express----------
const envport = process.env.SERVERPORT;
var app = express();
app.listen(envport, function () {
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw())
//-----------Express----------







//-----------ExpressFunctions----------
app.get('/grab', (req, res) => {


  res.status(200).send({ tradeHealth: checkData() });
  throw new Error('BROKEN') // Express will catch this on its own.
})







app.get('/', (req, res) => {
  res.send('Welcome to W3 REST API!!!');
});





app.post('/cnt', (req, res) => {
  let Info = req.body;
  if (Info.token == process.env.ADMINTOKEN) {


  }
  else {
    console.log('Invalid Token');
    res.status(200).send('Invalid Token');
  }
});











app.post('/uservalidation', async (req, res) => {
  let Info = req.body;
  const message = Info.message;
  const signedMsg = Info.signedMsg;
  let ures = await getUserWallet(Info.UID);
  if (ures) {
    res.status(200).send({ status: 'AlreadyExits' });
  } else {
    let result = userValidation(JSON.stringify(message), signedMsg);
    result.then(async function (r) {
      if (r) {
        console.log(Info.walletaddress);
        AddNewUser({ uid: Info.UID, wallet: Info.walletAddress }).then(() => {
          res.status(200).send({ status: 'Sucessfully Registered' });
        }).catch((e) => {
          console.error(e.message); // "oh, no!"
        });
      } else {
        console.log(r);
        res.status(200).send({ status: 'Fail' });
      }
    });
  }
})
//-----------ExpressFunctions----------


//-----------Tests--------

// getUserWallet('U123');
// AddNewUser({uid:'U123',wallet:'0x000123'});
// CNT({name:'dfx',symbol:'fcs',decimal:6});
// UpdateTokens({name:'Hellow',symbol:'Hlo',walletAddress:'0x4888E831eAEf1F4c4148e839Ce23b03A12b96745',amount:10.8,type:'buy'});
//w3Engine();//
// registerTrade({ userId: '5', walletAddress: 'info.walletAddress', tokenAmount: 500, tokenName: 'info.ShitCoin', instrumentType: 'Cash',tokenSymbol:'BTC'})

// var objectId =  {id:'634964f21afadb8df07b3293'};
// updateDocument({id:objectId,transactionHash:'xxxx',collectionName:'trades'});

//-----------Tests--------



//-----------fuctions--------







async function updateTokens(info) {//Create and mint
  try {
    let address = await getTokenAddress(info.name, info.instrumentType);

    if (address.toString() != '0x0000000000000000000000000000000000000000') {
      //already exits
      if (info.type == 'buy') {
        mintNewToken(info.name, info.amount, info.walletAddress)
      }
      else {//sell
        burnTokens(info.name, info.amount, info.walletAddress);
      }
    }
    else {

      return await createNewAndMint(info.name, info.symbol, info.amount, decimal, info.walletAddress, info.instrumentType);

    }
  } catch (error) {
    console.log(error);
  }
}

const updateSpeed = 3000;


async function w3Engine() {

  let count = await checkCount('trades');
  if (count > 0) {
    let doc = await getDocument('trades');
    let res = await updateTokens({ name: doc.tokenName, instrumentType: doc.instrumentType, symbol: doc.tokenSymbol, amount: doc.tokenAmount, walletAddress: doc.walletAddress });
    if (res.confirmation > 0) {
                //doc update in db as completed...
                //run Engine Again...
    } else {

    }
  }
  else {
    console.log('Hellow Dev!');
  }
  setTimeout(() => { w3Engine() }, updateSpeed);
}
//---------fuctions--------



//---------ExecutionBlock------

//---------ExecutionBlock------


////mongodb://localhost:27017/4NX