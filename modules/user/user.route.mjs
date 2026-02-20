import express from "express";
import { userController } from "./user.controller.mjs";
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

import {
  idParamRules,
  listRules,
  taskRules
} from "./user.rules.validation.mjs";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";
import { upload } from "../../utils/uploadConfig.mjs";

const router = express.Router();
//middleware to protect routes
router.use(verifyJWT);
router.use(rolecheck)
router.use(async (req, res, next) => { 
  if (req.role !== 'user') {
    return res.status(403).json({ message: 'Only user can access this route' });
  }
  next();
});

// LIST  PAGINATION
router.get(
  "/participation",
  validateRequest(listRules),
  userController.list
);
 
// LIST  PAGINATION
router.get(
  "/winning",
  validateRequest(listRules),
  userController.winninglist
);
router.post(
  "/task/submit",
  upload.none(),
  validateRequest({...idParamRules,...taskRules}),
  userController.submitTask
);


export default router;
