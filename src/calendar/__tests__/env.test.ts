import { describe, expect,it } from 'vitest'

import { BASE_DOMAIN, BASE_URL, CONFERENCE_MAPPER_SCRIPT, generateRoomNameAsDigits,NUMBER_RETRIEVE_SCRIPT, setConfig } from '../env'

describe('env', () => {
    it('setConfig updates domain and digits flag', () => {
        setConfig({ domain: 'meet.example.org', generateDigitsName: false })
        expect(BASE_DOMAIN).toBe('meet.example.org')
        expect(BASE_URL).toBe('https://meet.example.org/')
        expect(generateRoomNameAsDigits).toBe(false)
    })

    it('numbers script toggles by flags', () => {
        setConfig({ numbersEnabled: false, numbersUrl: 'https://api/numbers' })
        expect(NUMBER_RETRIEVE_SCRIPT).toBe(false)
        setConfig({ numbersEnabled: true, numbersUrl: 'https://api/numbers' })
        expect(NUMBER_RETRIEVE_SCRIPT).toBe('https://api/numbers')
    })

    it('mapper script set/reset', () => {
        setConfig({ mapperUrl: 'https://api/mapper' })
        expect(CONFERENCE_MAPPER_SCRIPT).toBe('https://api/mapper')
        setConfig({ mapperUrl: false })
        expect(CONFERENCE_MAPPER_SCRIPT).toBe(false)
    })
})


