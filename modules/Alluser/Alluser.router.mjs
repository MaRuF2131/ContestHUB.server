
import express from "express";
import { AllUserController } from "./Alluser.controller.mjs";
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

import {
  idParamRules,
  listContestRules
} from "./Alluser.rules.validation.mjs";
import verifyJWT from "../../middlewares/auth.middleware.mjs";

const router = express.Router();
//middleware to protect routes
router.use(verifyJWT);


// LIST ROOM + PAGINATION
router.get(
  "/get",
  validateRequest(listContestRules),
  AllUserController.list
);
router.get(
  "/get/single/:id",
  validateRequest(idParamRules),
  AllUserController.getSigle
);


export default router;
