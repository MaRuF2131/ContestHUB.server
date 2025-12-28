// controllers/payment.controller.js
import Stripe from "stripe";
import mongo from "../../MongoDB.mjs";
import { createPayment, getContest } from "./payment.service.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createIntent = async (req, res) => {
  try {
    const {contestId } = req.body;
    const user = req.user;
    const result=await getContest(contestId);
    if(result?.price) return res.status(401).json({message:"price is not define retry"});
    const amount=result?.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseFloat(amount) * 100,
      currency: "usd",
      metadata: {
        userMail: user?.email,
        userId:user?.uid,
        contestId,
      },
    });
    
    await createPayment(user,paymentIntent?.id,amount);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStatus=async(req,res)=>{
  try{
  const {contestId}=req.params;
  const user=req.user;
  const db = await mongo();
  const result=await db.collection("payments").findOne(
    {    
    userMail: user?.email,
    userId:user?.uid,
    contestId
   }
  )
  if(result?.status==='pending'){
   return res.status(201).json({ status:'pending' });
  }
  if(result?.status==='succeeded'){
   return res.status(201).json({ status:'succeeded' });
  }
  if(result?.status==='failed'){
   return res.status(201).json({ status:'failed' });
  }else{
    return res.status(201).json({ status:'Please payment' });
  }
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}
