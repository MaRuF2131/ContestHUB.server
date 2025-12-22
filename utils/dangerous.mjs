// utils/securityChecker.ts

import { isPlainObject } from "./sanitizer.mjs";


export async function containsDangerousContent(input){
  const cfg = {
    checkXSS: true,
    checkJSCalls: true,
    checkNoSQL: true,
    checkSQL: true,
    maxLength: 5000,
    customBlacklist: [],
  };

  const reasons = [];

  function checkString(str) {
    const s = str.trim();

    // XSS PATTERN CHECK
    if (cfg.checkXSS) {
      const xssPatterns = [
        /<\s*script\b/i,
        /<\s*iframe\b/i,
        /on\w+\s*=/i,
        /javascript\s*:/i,
        /<\s*img\b[^>]*on\w+/i,
        /<\s*svg\b/i,
        /<\s*object\b/i,
        /<\s*embed\b/i,
        /<\/\s*script\s*>/i,
      ];
      for (const p of xssPatterns)
        if (p.test(s)) {
          reasons.push("xss_pattern:" + p.toString());
          break;
        }
    }

    // JS Dangerous Calls
    if (cfg.checkJSCalls) {
      const jsPatterns = [
        /\beval\s*\(/i,
        /\bnew\s+Function\s*\(/i,
        /document\.cookie/i,
        /window\.location/i,
        /localStorage\.setItem/i,
        /sessionStorage\.setItem/i,
        /XMLHttpRequest/i,
        /fetch\s*\(/i,
      ];
      for (const p of jsPatterns)
        if (p.test(s)) {
          reasons.push("js_call:" + p.toString());
          break;
        }
    }

    // NoSQL Injection
    if (cfg.checkNoSQL) {
      if (/\$\w+/.test(s)) reasons.push("nosql_operator_in_string");
      if (/\.\.\//.test(s) || /\.\.\\/.test(s))
        reasons.push("path_traversal_like");
    }

    // SQL Injection Pattern
    if (cfg.checkSQL) {
      const sqlKeywords =
        /\b(select|union|insert|update|delete|drop|truncate|alter|create|exec|execute)\b/i;

      if (sqlKeywords.test(s) || /--|;--|;|\/\*/.test(s))
        reasons.push("sql_like_pattern");
    }

    // Length Check
    if (cfg.maxLength && s.length > cfg.maxLength)
      reasons.push("excessive_length");

    // Custom blacklist
    if (Array.isArray(cfg.customBlacklist)) {
      for (const c of cfg.customBlacklist) {
        if (typeof c === "string" && s.includes(c))
          reasons.push("custom_blacklist_string:" + c);
        else if (c instanceof RegExp && c.test(s))
          reasons.push("custom_blacklist_regex:" + c.toString());
      }
    }
  }

  // Walk full object deeply
  function walk(obj) {
    if (typeof obj === "string") return checkString(obj);
    if (Array.isArray(obj)) return obj.forEach(walk);
    if (isPlainObject(obj)) return Object.values(obj).forEach(walk);
  }

  walk(input);

  return {
    found: reasons.length > 0,
    reasons: Array.from(new Set(reasons)),
  };
}
