function getCrypto(): Crypto {
    if (typeof globalThis.crypto?.getRandomValues === "function") {
      return globalThis.crypto as Crypto;
    }
  
    try {
      if (typeof process !== "undefined" && process.versions?.node) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { webcrypto } = require("crypto");
        if (webcrypto?.getRandomValues) return webcrypto as unknown as Crypto;
      }
    } catch (e){
       /* eslint-disable no-console */
       console.error(e);
    }
  
    throw new Error("Secure RNG is unavailable in this environment.");
  }
  
  export function secureRandomInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer.");
    }
    const crypto = getCrypto();
    const arr = new Uint32Array(1);
    const range = maxExclusive >>> 0;
    const maxUnbiased = Math.floor(0x100000000 / range) * range;
  
    let r: number;
    do {
      crypto.getRandomValues(arr);
      r = arr[0]!;
    } while (r >= maxUnbiased);
  
    return r % range;
  }
  
  export function secureShuffle<T>(items: T[]): T[] {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  export function secureSample<T>(items: T[], k: number): T[] {
    if (k <= 0) return [];
    if (k >= items.length) return items.slice();
    return secureShuffle(items).slice(0, k);
  }
  