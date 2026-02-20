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
import { upload } from "../../utils/uploadConfig.mjs";
import { fileCheck } from "../../utils/filecheck.mjs";

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
  upload.single("image"),
  validateRequest(createContestRules),
  fileCheck("contest"),
  creatorController.create
);

// LIST  + PAGINATION
router.get(
  "/get",
  validateRequest(listContestRules),
  creatorController.list
);

// LIST  + PAGINATION
router.get(
  "/submissions",
  validateRequest({...listContestRules, ...idParamRules}),
  creatorController.submissionlist
);

// UPDATE 
router.patch(
  "/:id",
  upload.single("image"),
  validateRequest({ ...idParamRules, ...updateContestRules }),
  fileCheck("contest"),
  creatorController.update
);
// UPDATE 
router.patch(
  "/setwinner/:id",
  validateRequest(idParamRules),
  creatorController.setwinner
);

// DELETE 
router.delete(
  "/:id",
  validateRequest(idParamRules),
  creatorController.remove
);

export default router;
