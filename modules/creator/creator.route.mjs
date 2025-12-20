import { Router } from "express";
import { creatorController } from "./creator.controller.mjs";
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

import {
  createContestRules,
  updateContestRules,
  idParamRules,
  listContestRules
} from "./creator.rules.validation.mjs";

const router = Router();

// CREATE ROOM
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

// UPDATE ROOM
router.put(
  "/:id",
  validateRequest({ ...idParamRules, ...updateContestRules }),
  creatorController.update
);

// DELETE ROOM
router.delete(
  "/:id",
  validateRequest(idParamRules),
  creatorController.remove
);

export default router;
