import { describe, expect, it } from 'vitest'

import { DIGITS,randomDigitString, randomElement, randomInt } from '../randomUtil'

describe('randomUtil', () => {
    it('randomInt returns value in inclusive range', () => {
        for (let i = 0; i < 100; i++) {
            const v = randomInt(3, 7)
            expect(v).toBeGreaterThanOrEqual(3)
            expect(v).toBeLessThanOrEqual(7)
        }
    })

    it('randomElement works with arrays', () => {
        const arr = ['a', 'b', 'c']
        const el = randomElement(arr)
        expect(arr.includes(el as string)).toBe(true)
    })

    it('randomElement works with strings', () => {
        const el = randomElement('abc') as string
        expect('abc'.includes(el)).toBe(true)
    })

    it('randomDigitString returns requested length and checksum digits', () => {
        const len = 10
        const s = randomDigitString(len)
        expect(s).toHaveLength(len)
        // all digits
        for (const ch of s) {expect(DIGITS.includes(ch)).toBe(true)}
    })
})


