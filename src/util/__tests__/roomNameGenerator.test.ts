import { describe, expect,it } from 'vitest'

import { generateRoomWithoutSeparator } from '../roomNameGenerator'

describe('roomNameGenerator', () => {
    it('generates non-empty room using defaults', () => {
        const name = generateRoomWithoutSeparator()
        expect(typeof name).toBe('string')
        expect(name.length).toBeGreaterThan(0)
    })

    it('respects custom dictionary overrides', () => {
        const name = generateRoomWithoutSeparator({
            adjectives: ['Fast'],
            adverbs: ['very'],
            pluralNouns: ['Tests'],
            verbs: ['pass']
        } as any)
        expect(name).toMatch(/Fast|very|Tests|pass/i)
    })
})


