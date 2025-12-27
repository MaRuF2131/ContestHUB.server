// controllers/payment.controller.js
import Stripe from "stripe";
import mongo from "../../MongoDB.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createIntent = async (req, res) => {
  try {
    const { amount, contestId } = req.body;
    const user = req.user;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseFloat(amount) * 100,
      currency: "usd",
      metadata: {
        userMail: user?.email,
        userId:user?.uid,
        contestId,
      },
    });

    const db = await mongo();

    await db.collection("payments").insertOne({
      userMail: user?.email,
      userId:user?.uid,
      contestId,
      amount: parseFloat(amount),
      currency: "usd",
      paymentIntentId: paymentIntent?.id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
