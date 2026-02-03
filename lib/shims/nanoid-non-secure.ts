// Minimal `nanoid/non-secure` shim that works in both ESM imports and CJS `require()`.
// React Navigation and Expo Router both depend on this path on web; bundlers can
// sometimes get tripped up by ESM/CJS interop. Keeping the implementation local
// avoids package "exports" and interop edge cases.

// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
const urlAlphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

export function customAlphabet(alphabet: string, defaultSize = 21) {
  return (size = defaultSize) => {
    let id = "";
    let i = size | 0;
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0];
    }
    return id;
  };
}

export function nanoid(size = 21) {
  let id = "";
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id;
}

export default { nanoid, customAlphabet };

