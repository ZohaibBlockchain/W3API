import { createNewToken, userValidation, getTokenAddress, createNewAndMint, mintNewToken, burnTokens } from '../web3';
import { UserModel, TokenModel, TradeModel ,defaultIconModel} from '../../schemas';






//---------DBFunction----------
export async function userExits(_userUId) {
    return await UserModel.countDocuments({ "userUId": _userUId });
  }
  
  
  export async function AddNewUser(userData) {
    const NewUser = new UserModel({ userUId: userData.uid, userWallet: userData.wallet });
   return await NewUser.save();
  }
  

  export async function UpdateUserWallet(userData) {
  let result = await UserModel.findOneAndUpdate({userUId:userData._id},{$set:{userWallet:userData.address}});
  return result;
  }



  export async function registerTrade(info) {
    const newTrade = new TradeModel({ userId: info.uid, walletAddress: info.walletAddress, tokenAmount: info.tokenAmount, tokenName: info.tokenName, instrumentType: info.instrumentType, completed: false,tokenSymbol:info.tokenSymbol,transactionHash:""});
    newTrade.save().then(() => {
      console.log('New Trade Added');
      return true;
    });
  }


  export async function checkWalletExistence(address) {
    return await UserModel.countDocuments({userWallet:address});
  }
















  // export async function tokenRegister(info) {
  //   const newToken = new TokenModel({name:info.name,instrumentType:info.instrumentType,address:info.address,})
  //   newTrade.save().then(() => {
  //     console.log('New Trade Added');
  //     return true;
  //   });
  // }


  export async function createDefaultIcon(uri) {
    
    
    const newIcon = new defaultIconModel({iconuri:uri});
    let amount = await newIcon.collection.countDocuments();
    if(amount < 1)
    {
       let ico = await newIcon.save();
       return {status:'Created new'};
      }
    else{
      return {status:'Icon Already Created'};
    }
    }
  



//   export async function checkCount(collectionName) {
//     let col = db.collection(collectionName);
//     const count = await col.countDocuments()
//     console.log(count);
//     return count;
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
  
  
  
  
  
  //---------DBFunction----------
  