// controllers/payment.controller.js
import Stripe from "stripe";
import { createPayment, getContest,checkStatus } from "./payment.service.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createIntent = async (req, res) => {
  try {
    const {contestId } = req.body;
    const user = req.user;
    const rs=await checkStatus(contestId,user)
    if(rs?.status==='pending'){
      return res.status(401).json({ message:'Allready in pending' });
     }
     if(rs?.status==='succeeded'){
      return res.status(401).json({ message:'Allready payment'});
     }

    const result=await getContest(contestId);
    if(user?.email===result?.creator) return res.status(401).json({message:"Creator can not join"});
    if(!result?.price) return res.status(401).json({message:"price is not define retry"});
    const amount=result?.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseFloat(amount) * 100,
      currency: "usd",
      metadata: {
        userMail: user?.email,
        userId:user?.uid,
        contestId:contestId,
      },
    });
    
    await createPayment(user,contestId,paymentIntent?.id,amount);
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getStatus=async(req,res)=>{
  try{
  const {contestId}=req.params;
  const user=req.user;
  const result=await checkStatus(contestId,user);
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
