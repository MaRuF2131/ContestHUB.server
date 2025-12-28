import { isRequired, isValidString } from "../../utils/validation.mjs";
import validator from "validator";
export const idParamRules = {
    contestId: [
      [(v) => validator.isMongoId(String(v)), "Invalid  ID"],
      [(v) => isRequired(v), " ID is required"],
      [(v) => isValidString(v,24,24), " ID must be 24 characters"]
    ],
  };