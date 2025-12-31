import Stripe from "stripe";
import { ObjectId } from "mongodb";
import mongo from "../MongoDB.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(" Webhook verification failed");
    return res.status(400).send(err.message);
  }

  const db = await mongo();

  //  PAYMENT SUCCESS
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const payment = await db.collection("payments").findOneAndUpdate(
      { paymentIntentId: intent.id },
      {
        $set: {
          status: "succeeded",
          updatedAt: new Date(),
        },
      },
      { projection:{contestId:1}, returnDocument: "after" }
    );


    console.log("payment",payment);
    if (payment?.contestId) {
      await db.collection("contests").updateOne(
        { _id: new ObjectId(payment?.contestId) },
        { $inc: { participants: 1 } }
      );
    }
  }

  //  PAYMENT FAILED
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;

    await db.collection("payments").updateOne(
      { paymentIntentId: intent.id },
      {
        $set: {
          status: "failed",
          updatedAt: new Date(),
        },
      }
    );
  }

  res.json({ received: true });
};
