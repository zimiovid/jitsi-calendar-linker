/**
 * Numeric digit characters used to generate random strings.
 */
export const DIGITS = '0123456789'

/**
 * Returns a random integer within the inclusive range [min, max].
 * @param min - Minimum integer value.
 * @param max - Maximum integer value.
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Picks a random element from an array-like (string or array).
 * @param arr - Source array or string.
 */
export function randomElement<T extends { length: number }>(arr: T): T extends string ? string : T extends Array<infer U> ? U : unknown {
    // Supports strings and arrays
    const idx = randomInt(0, (arr as any).length - 1)

    return (arr as any)[idx] as any
}

/**
 * Generates a random string of digits with a checksum according to
 * ISO 7064 Mod 97,10. The last two digits are the checksum.
 * @param len - Total length of the generated string.
 */
export function randomDigitString(len: number): string {
    let body = ''
    let randomLen = len - 2
    while (randomLen--) {
        body += randomElement(DIGITS) as string
    }
    // compute mod 97 without losing leading zeros
    let mod = 0
    for (const ch of body) {
        mod = (mod * 10 + (ch.charCodeAt(0) - 48)) % 97
    }
    const verifyNumber = (98 - (mod * 100) % 97) % 97

    return body + (verifyNumber < 10 ? '0' : '') + verifyNumber.toString()
}

// Expose globals for legacy compatibility with existing code.

(globalThis as any).randomInt = randomInt;

(globalThis as any).randomElement = randomElement;

(globalThis as any).randomDigitString = randomDigitString


