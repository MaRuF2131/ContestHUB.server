import { ObjectId } from "mongodb";
import mongo from "../../MongoDB.mjs";

export const checkStatus=async(contestId,user)=>{
    try{
       const db=await mongo();
       const result=await db.collection("payments").findOne(
        {    
        userMail: user?.email,
        userId:user?.uid,
        contestId
       }
      )
     return result
    }catch(error){
        throw error
    }
};
export const getContest=async(contestId)=>{
    try{
       const db=await mongo();
       const result=await db.collection("contests").findOne({
          _id:new ObjectId(contestId)
       })
        return result
    }catch(error){
        throw error
    }
};

export const createPayment=async(user,contestId,paymentIntentId,amount)=>{
    try{
        const db=await mongo();
        await db.collection("payments").insertOne({
            userMail: user?.email,
            userId:user?.uid,
            contestId,
            amount: parseFloat(amount),
            currency: "usd",
            paymentIntentId:paymentIntentId,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return
    }catch(error){
        throw error
    }
}