
import { getUserWallet } from './db/db';
import express from 'express';
export const router = express.Router();
import { createNewToken, userValidation, getTokenAddress, createNewAndMint, mintNewToken, burnTokens } from'../web3';
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw())

const defaultTokenUri = 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/Basic-Attention-Token-icon.png';















router.get('/grab', (req, res) => {


    res.status(200).send({ tradeHealth: checkData() });
    throw new Error('BROKEN') // Express will catch this on its own.
  })
  
  
  
  router.get('/', (req, res) => {
    res.send('Welcome to W3 REST API!!!');
  });
  
  
  
  
  
  
  // app.post('/cnt', (req, res) => {
  //   let Info = req.body;
  //   if (Info.token == process.env.ADMINTOKEN) {
  
  
  //   }
  //   else {
  //     console.log('Invalid Token');
  //     res.status(200).send('Invalid Token');
  //   }
  // });
  
  
  
  
  router.post('/tokenaddress', async (req, res) => {
    let info = req.body;
   let result = await getTokenAddress(info.name,info.instrumentType);
    res.send(result);
  });
  
  
  
  router.post('/tokendetails', async (req, res) => {
    let info = req.body;
   let result = await getTokenAddress(info.name,info.instrumentType);
   let tokenDetails = {name:info.name,instrumentType:info.instrumentType,address:result,icon:defaultTokenUri}
    res.send(tokenDetails);
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  router.post('/uservalidation', async (req, res) => {
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


  router.get('*', function(req, res){
    res.send('what???', 404);
  });


  router.post('*', function(req, res){
    res.send('what???', 404);
  });
  