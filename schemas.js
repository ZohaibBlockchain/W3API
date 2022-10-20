// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const user = new Schema({
  userUId: {type:String,unique: true},
  userWallet: {type:String,unique: true},
});

const token = new Schema({
  name: String,
  instrumentType:String,
  address: String,
  iconuri: String
 
});


const defaultIcon = new Schema({
iconuri: {type:String ,required:true}
});

const trade = new Schema({
  userId: String,
  walletAddress: String,
  tokenAmount: Number,
  tokenName:String,
  tokenSymbol:String,
  instrumentType:String,
  completed:Boolean,
  transactionHash:String,
  time : { type : Date, default: Date.now }
});


export const TradeModel = mongoose.model("Trade", trade);
export const defaultIconModel = mongoose.model("icon", defaultIcon);0
export const TokenModel = mongoose.model("Token", token);
export const UserModel = mongoose.model("User", user);//First is the Name of the collection  2nd is the model