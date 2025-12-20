import { isRequired, isValidNumber, isValidString } from "../../utils/validation.mjs";
import validator from "validator";
import { DangerousContentCheck, DateValidationCheck } from "../../utils/validation.mjs";

export const createContestRules = {
  name: [
    [(v) => DangerousContentCheck(v,3,500), "Name is invalid"],
    [(v) => isRequired(v), "Name is required"]
  ],
  deadline: [
    [(v) => DateValidationCheck(v), "Deadline is invalid"],
    [(v) => isRequired(v), "Deadline is required"]
  ],
  taskInstruction: [
    [(v) => isValidString(v,3,1000), "Task Instruction is invalid"],
    [(v) => isRequired(v), "Task Instruction is required"]
  ],
  description: [
    [(v) => isValidString(v,3,1000), "Description is invalid"],
    [(v) => isRequired(v), "Description is required"]
  ],
  type: [
    [(v) => DangerousContentCheck(v,3,500), "Type is invalid"],
    [(v) => isRequired(v), "Type is required"]
  ],
  prizeMoney: [
    [(v) => isValidNumber(v,1,10000), "Prize Money is invalid"],
    [(v) => isRequired(v), "Prize Money is required"]
  ],
  price: [
    [(v) => isValidNumber(v,1,10000), "Price is invalid"],
    [(v) => isRequired(v), "Price is required"]
  ],
};

export const updateContestRules = {
   name: [
    [(v) => DangerousContentCheck(v,3,500), "Name is invalid"],
    [(v) => isRequired(v), "Name is required"]
  ],
  deadline: [
    [(v) => DateValidationCheck(v), "Deadline is invalid"],
    [(v) => isRequired(v), "Deadline is required"]
  ],
  taskInstruction: [
    [(v) => isValidString(v,3,1000), "Task Instruction is invalid"],
    [(v) => isRequired(v), "Task Instruction is required"]
  ],
  description: [
    [(v) => isValidString(v,3,1000), "Description is invalid"],
    [(v) => isRequired(v), "Description is required"]
  ],
  type: [
    [(v) => DangerousContentCheck(v,3,500), "Type is invalid"],
    [(v) => isRequired(v), "Type is required"]
  ],
  prizeMoney: [
    [(v) => isValidNumber(v,1,10000), "Prize Money is invalid"],
    [(v) => isRequired(v), "Prize Money is required"]
  ],
  price: [
    [(v) => isValidNumber(v,1,10000), "Price is invalid"],
    [(v) => isRequired(v), "Price is required"]
  ],
};

export const idParamRules = {
  id: [
    [(v) => validator.isMongoId(String(v)), "Invalid  ID"],
    [(v) => isRequired(v), " ID is required"],
    [(v) => isValidString(v,24,24), " ID must be 24 characters"]
  ],
};

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
