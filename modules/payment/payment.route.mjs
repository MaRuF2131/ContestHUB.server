import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";
import { stripeWebhook } from "../../middlewares/stripeWebhook.mjs";
import { createIntent } from "./payment.controller.mjs";
import cookieParser from "cookie-parser";
import cors from "cors"

const router = express.Router();

//payment webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
//middleware to protect routes
const isAuth=(async (req, res,next) => { 
  console.log("role",req.role);
  if (req.role !== 'user') {
    return res.status(403).json({ message: 'Only user can access this route' });
  }
  next();
});


router.use(cookieParser());
router.use(cors({origin:['http://localhost:5173'],credentials:true ,allowedHeaders: ['Content-Type', 'Authorization', 'x-user','authorization',"stripe-signature"]}));
router.use(express.json());

// payment intent create
router.post("/create-intent",verifyJWT,rolecheck,isAuth, createIntent);


export default router;

  