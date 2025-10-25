import { describe, expect, it, vi } from 'vitest'

import { setConfig } from '../env'
import { EventContainer } from '../event'

describe('EventContainer core', () => {
    it('extractMeetingId returns null when BASE_URL not present', () => {
        const ev = new EventContainer()
        // @ts-ignore accessing private via any for test
        expect((ev as any).extractMeetingId('no link here')).toBeNull()
    })

    it('updateMeetingId resets when button not present, generates id, and auto-creates when numbers disabled', async () => {
        setConfig({ numbersEnabled: false, mapperUrl: false, generateDigitsName: true })
        const ev = new EventContainer()
        const clickSpy = vi.fn()
        Object.defineProperty(ev as any, 'description', { get: () => ({ clickAddMeeting: clickSpy }), configurable: true })
        ev.scheduleAutoCreateMeeting = true
        ev.updateMeetingId()
        expect((ev as any).meetingId).toBeDefined()
        expect(clickSpy).toHaveBeenCalled()
        expect(ev.scheduleAutoCreateMeeting).toBe(false)
    })

    it('maybeFetchNumbersAndAutoCreate fetches templates and sets numbers', async () => {
        setConfig({ numbersEnabled: true, numbersUrl: 'https://numbers.test/x', generateDigitsName: false })
        const ev = new EventContainer()
        const json = () => Promise.resolve({
            inviteTextTemplate: '{BASE_URL}{MEETING_ID}',
            numbersEnabled: true,
            numbers: { US: '+1 111' },
            inviteNumbersTextTemplate: '\n{US}',
            roomNameDictionary: ['alpha', 'beta']
        }) as any
        const resp = { json } as any
        const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue(resp)
        Object.defineProperty(ev as any, 'description', { get: () => ({ clickAddMeeting: vi.fn() }), configurable: true })
        ev.scheduleAutoCreateMeeting = true;
(ev as any).updateMeetingId() // triggers maybeFetchNumbersAndAutoCreate
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await new Promise(r => setTimeout(r, 0))
        expect(fetchSpy).toHaveBeenCalled()
        expect(Object.keys(ev.numbers)).toContain('US')
        fetchSpy.mockRestore()
    })

    it('maybeFetchNumbersAndAutoCreate handles fetch error', async () => {
        setConfig({ numbersEnabled: true, numbersUrl: 'https://numbers.test/x' })
        const ev = new EventContainer()
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockRejectedValue(new Error('boom'));
(ev as any).updateMeetingId()
        await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await new Promise(r => setTimeout(r, 0))
        expect(errSpy).toHaveBeenCalled()
        fetchSpy.mockRestore()
        errSpy.mockRestore()
    })
})


