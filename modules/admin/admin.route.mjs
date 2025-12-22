import express from "express";
import { adminController } from "./admin.controller.mjs";
import { validateRequest } from "../../middlewares/validate.middleware.mjs";

import {
  idParamRules,
  listRules
} from "./admin.rules.validation.mjs";
import verifyJWT from "../../middlewares/auth.middleware.mjs";
import rolecheck from "../../utils/Rolecheck.mjs";

const router = express.Router();
//middleware to protect routes
router.use(verifyJWT);
router.use(rolecheck)
router.use(async (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this route' });
  }
  next();
});

// LIST  + PAGINATION
router.get(
  "/get/contest",
  validateRequest(listRules),
  adminController.Contestlist
);
// LIST  + PAGINATION
router.get(
  "/get/user",
  validateRequest(listRules),
  adminController.Userlist
);

// UPDATE 
router.patch(
  "/contest/:id",
  validateRequest(idParamRules),
  adminController.updateStatus
);
// UPDATE 
router.patch(
  "/user/:id",
  validateRequest(idParamRules),
  adminController.updateRole
);

// DELETE 
router.delete(
  "/:id",
  validateRequest(idParamRules),
  adminController.remove
);


export default router;
