import xss from "xss";
import validator from "validator";

// ===============================
// SANITIZER + SECURITY HELPERS
// ===============================

export function isPlainObject(val){
  return Object.prototype.toString.call(val) === "[Object Object]";
}

export function sanitizeString(str, options={ maxLength } = {}) {
  if (typeof str !== "string") return str;
  let s = str.trim();
  s = s.replace(/\0/g, ""); // remove null bytes
  s = xss(s); // prevent XSS
  if (options.maxLength && s.length > options.maxLength) {
    s = s.slice(0, options.maxLength);
  }
  return s;
}

/**
 * Sanitize deeply any input object/array/string
 */
export function sanitizeObject(input, options={ maxStringLength = 10000, allowedKeysRegex = null, removeEmpty = false } = {}) {
  const { maxStringLength = 10000, allowedKeysRegex = null, removeEmpty = false } = options;

  if (typeof input === "string") return sanitizeString(input, { maxLength: maxStringLength });
  if (typeof input === "number" || typeof input === "boolean" || input === null) return input;

  if (Array.isArray(input)) {
    return input
      .map((item) => sanitizeObject(item, options))
      .filter((v) => !(removeEmpty && v === ""));
  }

  if (isPlainObject(input)) {
    const out= {};
    for (const [rawKey, rawVal] of Object.entries(input)) {
      if (rawKey.startsWith("$")) continue;
      if (rawKey.includes(".")) continue;
      if (["__proto__", "constructor", "prototype"].includes(rawKey)) continue;

      if (allowedKeysRegex && !allowedKeysRegex.test(rawKey)) continue;

      const safeKey = validator.whitelist(rawKey, "a-zA-Z0-9_\\-");
      if (!safeKey) continue;

      const cleanVal = sanitizeObject(rawVal, options);
      if (
        removeEmpty &&
        (cleanVal === "" || (Array.isArray(cleanVal) && cleanVal.length === 0))
      ) {
        continue;
      }
      out[safeKey] = cleanVal;
    }
    return out;
  }

  return input;
}

/**
 * Middleware: sanitize req.body/query/params
 */
export function sanitizeMiddleware(options= {}) {
  return async (req, res, next) => {
    try {
      if (req.body) req.body = sanitizeObject(req.body, options);
      if (req.query) {
        const cleanQuery = sanitizeObject(req.query, options);
        for (const key of Object.keys(req.query)) delete req.query[key];
        Object.assign(req.query, cleanQuery);
      }
      if (req.params) {
        const cleanParams = sanitizeObject(req.params, options);
        for (const key of Object.keys(req.params)) delete req.params[key];
        Object.assign(req.params, cleanParams);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

