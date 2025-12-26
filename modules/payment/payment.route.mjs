import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";
import { stripeWebhook } from "../../middlewares/stripeWebhook.mjs";
import { createIntent } from "./payment.controller.mjs";

const router = express.Router();
//middleware to protect routes
router.use(verifyJWT);
router.use(rolecheck)
const isAuth=(async (req, res, next) => { 
  if (req.role !== 'user') {
    return res.status(403).json({ message: 'Only user can access this route' });
  }
  next();
});

// payment intent create
router.post("/create-intent", isAuth, createIntent);

//payment webhook
router.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


export default router;

  