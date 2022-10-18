// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const user = new Schema({
  userUId: String,
  userWallet: String,
});

const token = new Schema({
  name: String,
  instrumentType:String,
  address: String,
  iconuri: String
 
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
export const TokenModel = mongoose.model("Token", token);
export const UserModel = mongoose.model("User", user);//First is the Name of the collection  2nd is the model