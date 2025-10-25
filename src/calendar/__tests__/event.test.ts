import { beforeEach,describe, expect, it, vi } from 'vitest'

import { setConfig } from '../env'
import { EventContainer } from '../event'

class TestEvent extends EventContainer {
    constructor() { super(); (this as any).buttonContainerInstance = document.createElement('div') }
}

beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

describe('EventContainer.updateMeetingId', () => {
    it('reuses meeting id from existing text', () => {
        setConfig({ domain: 'meet.t' })
        const e = new TestEvent();
(e as any).descriptionInstance = { value: 'Link: https://meet.t/RoomX' }
        vi.spyOn(e, 'isButtonPresent').mockReturnValue(true)
        e.updateMeetingId()
        expect((e as any).meetingId).toBe('RoomX')
    })

    it('generates digits or words when no existing id', () => {
        setConfig({ domain: 'meet.t', generateDigitsName: true })
        const e = new TestEvent()
        vi.spyOn(e, 'isButtonPresent').mockReturnValue(true)
        e.updateMeetingId()
        expect((e as any).meetingId).toMatch(/^[0-9]{10}$/)
    })

    it('fetch path fills numbers and may autocreate', async () => {
        setConfig({ domain: 'meet.t', numbersEnabled: true, numbersUrl: 'https://api/numbers' })
        const json = vi.fn().mockResolvedValue({
            inviteTextTemplate: 'tmpl',
            numbersEnabled: true,
            numbers: { US: '+1' },
            inviteNumbersTextTemplate: 'ntmpl'
        })
        vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({ json } as any)
        const e = new TestEvent();
(e as any).descriptionInstance = { clickAddMeeting: vi.fn(), value: '' }
        vi.spyOn(e, 'isButtonPresent').mockReturnValue(true)
        e.scheduleAutoCreateMeeting = true
        e.updateMeetingId()
        await Promise.resolve()
        await Promise.resolve()
        await new Promise(r => setTimeout(r, 0))
        expect((e as any).inviteTextTemplate).toBe('tmpl')
        expect(Object.keys(e.numbers).length).toBe(1)
        expect(e.scheduleAutoCreateMeeting).toBe(false)
    })
})


