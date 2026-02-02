/**
 * Input sanitization utilities
 * Provides protection against XSS and injection attacks
 */

// HTML tags and attributes that are not allowed
const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "textarea",
  "button",
  "link",
  "style",
  "meta",
  "head",
  "body",
  "html",
  "base",
  "svg",
  "math",
  "applet",
  "frame",
  "frameset",
  "blink",
  "marquee",
  "title",
];

const DANGEROUS_ATTRIBUTES = [
  "onload",
  "onunload",
  "onerror",
  "onclick",
  "ondblclick",
  "onmousedown",
  "onmouseup",
  "onmouseover",
  "onmousemove",
  "onmouseout",
  "onfocus",
  "onblur",
  "onkeypress",
  "onkeydown",
  "onkeyup",
  "onsubmit",
  "onreset",
  "onselect",
  "onchange",
  "onabort",
  "oncanplay",
  "oncanplaythrough",
  "oncuechange",
  "ondurationchange",
  "onemptied",
  "onended",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onseeked",
  "onseeking",
  "onstalled",
  "onsuspend",
  "ontimeupdate",
  "onvolumechange",
  "onwaiting",
  "style",
];

const DANGEROUS_PROTOCOLS = [
  "javascript:",
  "vbscript:",
  "data:",
  "file:",
  "about:",
  "chrome:",
  "resource:",
];

/**
 * Sanitize a string by removing dangerous HTML tags and attributes
 * @param input - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input;

  // Remove dangerous HTML tags
  DANGEROUS_TAGS.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, "gi");
    sanitized = sanitized.replace(regex, "");
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\/?>`, "gi");
    sanitized = sanitized.replace(selfClosingRegex, "");
  });

  // Remove dangerous attributes from remaining tags
  DANGEROUS_ATTRIBUTES.forEach((attr) => {
    const regex = new RegExp(`\\s${attr}=["'][^"']*["']`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  // Remove dangerous protocols
  DANGEROUS_PROTOCOLS.forEach((protocol) => {
    const regex = new RegExp(protocol, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  // Remove remaining angle brackets (just to be safe)
  sanitized = sanitized.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return sanitized;
}

/**
 * Sanitize an object by sanitizing all string values recursively
 * @param obj - The object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string"
            ? sanitizeString(item)
            : typeof item === "object"
              ? sanitizeObject(item)
              : item
        );
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize text for display in UI (lighter sanitization)
 * Preserves basic formatting but removes dangerous content
 * @param input - The text to sanitize
 * @returns Sanitized text safe for display
 */
export function sanitizeDisplayText(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input;

  // Remove script tags and event handlers but allow basic HTML
  const dangerousTags = ["script", "iframe", "object", "embed", "form"];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?<\/${tag}>`, "gi");
    sanitized = sanitized.replace(regex, "");
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\/?>`, "gi");
    sanitized = sanitized.replace(selfClosingRegex, "");
  });

  // Remove event handlers from all tags
  DANGEROUS_ATTRIBUTES.forEach((attr) => {
    const regex = new RegExp(`\\s${attr}=["'][^"']*["']`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  // Remove javascript protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  return sanitized;
}

/**
 * Validate that a string doesn't contain dangerous patterns
 * @param input - The string to validate
 * @returns True if safe, false if potentially dangerous
 */
export function isSafeString(input: string): boolean {
  if (!input || typeof input !== "string") {
    return true;
  }

  // Check for script tags
  if (/<script/i.test(input)) {
    return false;
  }

  // Check for event handlers
  const hasEventHandler = DANGEROUS_ATTRIBUTES.some((attr) =>
    new RegExp(`\\s${attr}=`, "i").test(input)
  );
  if (hasEventHandler) {
    return false;
  }

  // Check for dangerous protocols
  const hasDangerousProtocol = DANGEROUS_PROTOCOLS.some((protocol) =>
    input.toLowerCase().includes(protocol)
  );
  if (hasDangerousProtocol) {
    return false;
  }

  return true;
}

/**
 * Sanitize user notes/journal content
 * This is a specialized sanitizer for user-generated content
 * @param content - The user content to sanitize
 * @returns Sanitized content
 */
export function sanitizeUserContent(content: string): string {
  if (!content || typeof content !== "string") {
    return "";
  }

  let sanitized = content;

  // Remove null bytes
  sanitized = sanitized.replace(/\x00/g, "");

  // Normalize line endings
  sanitized = sanitized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Limit consecutive newlines to prevent formatting abuse
  sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n");

  // Apply full sanitization
  sanitized = sanitizeString(sanitized);

  return sanitized;
}

/**
 * Sanitize baby names and titles (stricter rules)
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  // Trim whitespace
  let sanitized = name.trim();

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // Apply full sanitization
  sanitized = sanitizeString(sanitized);

  return sanitized;
}

/**
 * Sanitize an array of strings
 * @param arr - The array to sanitize
 * @returns Sanitized array
 */
export function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .filter((item) => typeof item === "string")
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0);
}
