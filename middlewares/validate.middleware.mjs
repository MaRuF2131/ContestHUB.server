// src/utils/validate.middleware.ts

import { containsDangerousContent } from "../utils/dangerous.mjs";
import { runValidations } from "../utils/validation.mjs";

export const validateRequest = (  rules={}) => {
    return async (req, res, next) => {
        // merge all input sources
        const combinedData = {
            ...req.body,
            ...req.params,
            ...req.query,
        };       
        // dangerous content check
        const danger = await containsDangerousContent(combinedData);

        if (danger?.found) {
            return res.status(400).json({
                message: "Dangerous content detected",
                reasons: danger.reasons,
            });
        }

        // field validation (only for body fields)
        const result = await runValidations(rules, combinedData);

        if (!result.isValid) {
            return res.status(422).json(result.errors);
        }

        next();
    };
};
