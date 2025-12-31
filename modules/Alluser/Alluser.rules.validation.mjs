import {isRequired, isValidNumber, isValidString} from "../../utils/validation.mjs";
import validator from "validator";
import { DangerousContentCheck} from "../../utils/validation.mjs";

export const listContestRules = {
  page: [
    [(v) => v === undefined || validator.isInt(String(v)), "Page must be number"],
    [(v) => isValidNumber(v, 1), "Page must be at least 1"],
  ],
  limit: [
    [(v) => v === undefined || validator.isInt(String(v)), "limit must be number"],
    [(v) => isValidNumber(v, 1,10), "limit must be at least 1"],
  ],
  search: [
    [(v) => v === undefined || typeof v === "string", "search must be text"],
    [(v) => v === undefined || DangerousContentCheck(v, 1, 255), "search is invalid"]
  ],
 type: [
    [(v) => DangerousContentCheck(v,1,500), "Type is invalid"],
  ],
  status:[
     [(v) => DangerousContentCheck(v,1,500), "Type is invalid"],
  ]
};

export const idParamRules = {
  id: [
    [(v) => validator.isMongoId(String(v)), "Invalid  ID"],
    [(v) => isRequired(v), " ID is required"],
    [(v) => isValidString(v,24,24), " ID must be 24 characters"]
  ],
};
