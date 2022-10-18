import { createNewToken, userValidation, getTokenAddress, createNewAndMint, mintNewToken, burnTokens } from '../../web3';
import { UserModel, TokenModel, TradeModel } from '../../../schemas';





//---------DBFunction----------
export async function getUserWallet(_userUId) {
    let x = await UserModel.find({ "userUId": _userUId });
  
    if (x.length > 0) {
      console.log(x[0].userWallet);
      return true;
    } else {
      console.log('N?A');
      return false;
    }
  }
  
  
  
//   export async function checkCount(collectionName) {
//     let col = db.collection(collectionName);
//     const count = await col.countDocuments()
//     console.log(count);
//     return count;
//   }
  
//   export async function getDocument(collectionName) {
//     let col = db.collection(collectionName);
//     return await col.findOne({ completed: false });
//   }
  
//   export async function deleteDocument(collectionName, id) {
//     let col = db.collection(collectionName);
//     return await col.deleteOne({ _id: id });
//   }
  
  
//   export async function updateDocument(args) {
//     let col = db.collection(args.collectionName);
//     console.log(col.name);
//     return await col.findOneAndUpdate({_id:x},{$set:{transactionHash:args.transactionHash}});
//   }
  
//   export async function AddNewUser(userData) {
//     const NewUser = new UserModel({ userUId: userData.uid, userWallet: userData.wallet });
//     NewUser.save().then(() => {
//       console.log('New User Added');
//       return true;
//     });
//   }
  
  
//   export async function registerTrade(info) {
//     const newTrade = new TradeModel({ userId: info.uid, walletAddress: info.walletAddress, tokenAmount: info.tokenAmount, tokenName: info.tokenName, instrumentType: info.instrumentType, completed: false,tokenSymbol:info.tokenSymbol,transactionHash:""});
//     newTrade.save().then(() => {
//       console.log('New Trade Added');
//       return true;
//     });
//   }
  
  
  //---------DBFunction----------
  