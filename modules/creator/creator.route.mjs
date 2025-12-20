import express from "express";
import { creatorController } from "./creator.controller.mjs";
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

import {
  createContestRules,
  updateContestRules,
  idParamRules,
  listContestRules
} from "./creator.rules.validation.mjs";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";

const router = express.Router();
//middleware to protect routes
router.use(verifyJWT);
router.use(rolecheck)
router.use(async (req, res, next) => {
  if (req.role !== 'creator') {
    return res.status(403).json({ message: 'Only creator can access this route' });
  }
  next();
});

// CREATE 
router.post(
  "/create",
  validateRequest(createContestRules),
  creatorController.create
);

// LIST ROOM + PAGINATION
router.get(
  "/get",
  validateRequest(listContestRules),
  creatorController.list
);

// UPDATE 
router.put(
  "/:id",
  validateRequest({ ...idParamRules, ...updateContestRules }),
  creatorController.update
);

// DELETE 
router.delete(
  "/:id",
  validateRequest(idParamRules),
  creatorController.remove
);

export default router;
