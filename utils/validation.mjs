// src/utils/validation.ts

const DANGEROUS_PATTERNS = [
/[`'"<>]/, // quotes, angle brackets, backtick
/<script>/i, // script tags
/<\/?.+?>/, // any HTML tag
/on\w+\s*=/i, // inline JS events like onclick=
];
const DANGEROUS_PATTERNS2 = [
/[`<>]/, //  angle brackets, backtick
/<script>/i, // script tags
/<\/?.+?>/, // any HTML tag
/on\w+\s*=/i, // inline JS events like onclick=
];

export const isRequired = (v) => v !== undefined && v !== null && v !== "";

export const isValidString = async(v, min = 1, max = 255) => {
    if (typeof v !== "string") return false;
    const s = v.trim();
    if (s.length < min || s.length > max) return false;
    if (DANGEROUS_PATTERNS2.some(pattern => pattern.test(s))) return false;
    return true;
};

export const DangerousContentCheck = async (v,min = 1, max = 2000) => {
    if (typeof v !== "string") return false;
    const s = v.trim();
    if (s.length < min || s.length > max) return false;
    if (DANGEROUS_PATTERNS.some(pattern => pattern.test(s))) return false;
    return true;
};

export const UrlValidationCheck = async (v) => {
        try {
          new URL(v);
          if (await DangerousContentCheck(v) !== true) {
            return false;
          }
          return true;
        } catch (e) {
          return false
        }
};

export const DateValidationCheck = async (v) => {
        const date = new Date(v);
        if (isNaN(date.getTime()) || await DangerousContentCheck(v) !== true) {
          return false;
        }
        return true;
};

export const FilCheck=async(v)=>{
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
        if(v.length===0){
          return false;
        }
        const file=v[0];
        if(!allowedTypes.includes(file.type)){
          return false;
        } 
        if(file.size>5*1024*1024){
          return false;
        } 
        return true;
}

export const isValidEmail = (v) =>{
    if(DangerousContentCheck(v) !== true) return false
    if(typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ) return true;
    return false;
}

export const isValidNumber = (v, min=1, max=10000) => {
    const num = Number(v);  
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
};

export  const runValidations = async (rules={},data={}) => {
    const errors = {};
    for (const [field, validators] of Object.entries(rules)) {
        const value = data[field];
        for (const [check, msg] of validators) {
            if (!check(value)) {
                errors[field] = msg;
                break;
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
