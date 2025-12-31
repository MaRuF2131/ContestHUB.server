import express from "express";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";
import { stripeWebhook } from "../../middlewares/stripeWebhook.mjs";
import { createIntent, getStatus } from "./payment.controller.mjs";
import cookieParser from "cookie-parser";
import cors from "cors"

const router = express.Router();
import {idParamRules} from "./payment.rules.validation.mjs"
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

//payment webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


router.use(cookieParser());
router.use(cors({origin:['http://localhost:5173'],credentials:true ,allowedHeaders: ['Content-Type', 'Authorization', 'x-user','authorization',"stripe-signature"]}));
router.use(express.json());
//middleware to protect routes
router.use(verifyJWT);
router.get('/payment_status/:contestId',validateRequest(idParamRules),getStatus)

router.use(rolecheck);
router.use(async (req, res,next) => { 
  console.log("role",req.role);
  if (req.role !== 'user') {
    return res.status(403).json({ message: 'Only user can access this route' });
  }
  next();
});

// payment intent create
router.post("/create-intent",validateRequest(idParamRules), createIntent);


export default router;

  