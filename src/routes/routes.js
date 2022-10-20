
import { userExits, UpdateUserWallet, AddNewUser, registerTrade, createDefaultIcon, checkWalletExistence } from '../db/db';
import express from 'express';
export const router = express.Router();
import { createNewToken, userValidation, getTokenAddress, createNewAndMint, mintNewToken, burnTokens } from '../web3';
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw())

const defaultTokenUri = 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/Basic-Attention-Token-icon.png';















router.get('/test', (req, res) => {
  registerTrade({ userId: '5', walletAddress: 'info.walletAddress', tokenAmount: 500, tokenName: 'info.ShitCoin', instrumentType: 'Cash', tokenSymbol: 'BTC' });
  res.send('Trade Registered Sucessfully');
})



router.get('/', (req, res) => {
  res.send('Welcome to W3 REST API!!!');
});




router.post('/createnewicon', async (req, res) => {
  let info = req.body;
  let result = await createDefaultIcon(info.uri);
  console.log(result);
  res.send(result);
})







router.post('/tokenaddress', async (req, res) => {
  let info = req.body;
  let result = await getTokenAddress(info.name, info.instrumentType);
  res.send(result);
});



router.post('/tokendetails', async (req, res) => {
  let info = req.body;
  let result = await getTokenAddress(info.name, info.instrumentType);
  let tokenDetails = { name: info.name, instrumentType: info.instrumentType, address: result, icon: defaultTokenUri }
  res.send(tokenDetails);
});













router.post('/uservalidation', async (req, res) => {

  let info = req.body;
  const message = info.message;
  const signedMsg = info.signedMsg;
if(info.walletAddress === info.message.walletaddress)
{


  let walletcount = await checkWalletExistence(info.walletAddress)
  if (walletcount == 0)//wallet not exits
  {
    let user = await userExits(info.UID)
    if (user == 0)//user not exits
    {
      let result = await userValidation(JSON.stringify(message), signedMsg);
      if (result) {
        let _res = await AddNewUser({ uid: info.UID, wallet: info.walletAddress })
        if (_res) {
          res.status(200).send({ status: 'Successfully registered a new user' });
        } else {
          res.status(400).send({ status: 'Unexpected error while registering user' });
        }
      }
      else {
        res.status(400).send({ status: 'Invalid user' });
      }
    } else {//user exits
      let result = await userValidation(JSON.stringify(message), signedMsg);
      if (result) {
        let result = UpdateUserWallet({ _id: info.UID, address: info.walletAddress })
        if (result) {
          res.status(200).send({ status: 'Successfully updated the user' });
        } else {
          res.status(400).send({ status: 'Unexpected error while Updating user' });
        }
      } else {
        res.status(400).send({ status: 'Invalid user' });
      }
    }
  }
  else {
    res.status(200).send({ status: 'Wallet already linked with some other account' });
  }
}
else{
  res.status(400).send({ status: 'Invalid signature wallet should be same' });
}


})








router.get('*', function (req, res) {
  res.send('Invalid request', 404);
});


router.post('*', function (req, res) {
  res.send('Invalid request', 404);
});
