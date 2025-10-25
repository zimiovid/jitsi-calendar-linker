import { describe, expect, it, vi } from 'vitest'

import { Description } from '../description'
import { setConfig } from '../env'
import { Location } from '../location'

function makeEvent(overrides: any = {}) {
    return {
        meetingId: 'room123',
        numbers: undefined,
        inviteTextTemplate: undefined,
        inviteNumbersTextTemplate: undefined,
        ...overrides
    } as any
}

describe('calendar description/location core', () => {
    it('getInviteText builds default invite text with BASE_URL and meetingId', () => {
        const event = makeEvent()
        const d = new Description(event)
        const txt = d.getInviteText()
        expect(txt).toContain('Click the following link to join the meeting from your computer: ')
        expect(txt).toContain(event.meetingId)
    })

    it('getInviteText uses template with placeholders and numbers', () => {
        const event = makeEvent({
            numbers: { US: '+1 111', DE: '+49 222' },
            inviteTextTemplate: '{BASE_URL}{MEETING_ID}',
            inviteNumbersTextTemplate: '\n{US}\n{DE}'
        })
        const d = new Description(event)
        const txt = d.getInviteText('9999')
        expect(txt).toContain('room123')
        expect(txt).toMatch(/https?:\/\//)
        expect(txt).toContain('US: +1 111')
        expect(txt).toContain('DE: +49 222')
    })

    it('updateInitialButtonURL wires anchor click to clickAddMeeting(false, location)', async () => {
        document.body.innerHTML = '<div id="jitsi_button"><a href="#">x</a></div>'
        const event = makeEvent()
        const d = new Description(event)
        const loc = new Location()
        const spy = vi.spyOn(d, 'clickAddMeeting').mockResolvedValue(undefined as any)
        d.updateInitialButtonURL(loc as any)
        const a = document.querySelector('#jitsi_button a') as HTMLAnchorElement
        a.click()
        expect(spy).toHaveBeenCalledWith(false, loc)
    })

    it('updateButtonURL sets href/target and label', () => {
        document.body.innerHTML = '<div id="jitsi_button"><a href="#">x</a></div>'
        const event = makeEvent()
        const d = new Description(event)
        d.updateButtonURL()
        const a = document.querySelector('#jitsi_button a') as HTMLAnchorElement
        expect(a.textContent || '').toContain('Join your')
        expect(a.getAttribute('href') || '').toContain(event.meetingId)
        expect(a.getAttribute('target')).toBe('_new')
    })

    it('update() chooses updateButtonURL when description has BASE_URL', () => {
        const event = makeEvent()
        const d = new Description(event)
        Object.defineProperty(d as any, 'element', { value: true })
        Object.defineProperty(d as any, 'value', { value: 'foo https://meet.jit.si/room123' })
        const loc = new Location()
        const spyUpdate = vi.spyOn(d, 'updateButtonURL')
        const spyInit = vi.spyOn(d, 'updateInitialButtonURL')
        d.update(loc as any)
        expect(spyUpdate).toHaveBeenCalled()
        expect(spyInit).not.toHaveBeenCalled()
    })

    it('update() falls back to updateInitialButtonURL when no URL and no LOCATION_TEXT', () => {
        const event = makeEvent()
        const d = new Description(event)
        Object.defineProperty(d as any, 'element', { value: true })
        Object.defineProperty(d as any, 'value', { value: 'no links here' })
        const loc = new Location()
        const spyUpdate = vi.spyOn(d, 'updateButtonURL')
        const spyInit = vi.spyOn(d, 'updateInitialButtonURL')
        d.update(loc as any)
        expect(spyInit).toHaveBeenCalled()
        expect(spyUpdate).not.toHaveBeenCalled()
    })

    it('clickAddMeeting without mapper adds default invite text', async () => {
        setConfig({ mapperUrl: false })
        const event = makeEvent()
        const d = new Description(event)
        const addSpy = vi.spyOn(d, 'addDescriptionText')
        await d.clickAddMeeting(false as any, {} as any)
        expect(addSpy).toHaveBeenCalled()
        expect((addSpy.mock.calls[0][0] as string)).toContain(event.meetingId)
    })

    it('clickAddMeeting with mapper uses returned id when present', async () => {
        setConfig({ mapperUrl: 'https://mapper.test/x' })
        const event = makeEvent({ inviteTextTemplate: '{DIALIN_ID}' })
        const d = new Description(event)
        const addSpy = vi.spyOn(d, 'addDescriptionText')
        const json = () => Promise.resolve({ conference: true, id: 'dial-777' }) as any
        const resp = { json } as any
        const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue(resp)
        await d.clickAddMeeting(false as any, {} as any)
        expect(fetchSpy).toHaveBeenCalled()
        expect((addSpy.mock.calls[0][0] as string)).toContain('dial-777')
        fetchSpy.mockRestore()
    })

    it('clickAddMeeting with mapper falls back when id missing', async () => {
        setConfig({ mapperUrl: 'https://mapper.test/x' })
        const event = makeEvent()
        const d = new Description(event)
        const addSpy = vi.spyOn(d, 'addDescriptionText')
        const json = () => Promise.resolve({ ok: true }) as any
        const resp = { json } as any
        const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue(resp)
        await d.clickAddMeeting(false as any, {} as any)
        expect(fetchSpy).toHaveBeenCalled()
        expect((addSpy.mock.calls[0][0] as string)).toContain(event.meetingId)
        fetchSpy.mockRestore()
    })

    it('clickAddMeeting handles fetch error and still adds default invite', async () => {
        setConfig({ mapperUrl: 'https://mapper.test/x' })
        const event = makeEvent()
        const d = new Description(event)
        const addSpy = vi.spyOn(d, 'addDescriptionText')
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        const fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockRejectedValue(new Error('boom'))
        await d.clickAddMeeting(false as any, {} as any)
        expect(errSpy).toHaveBeenCalled()
        expect(addSpy).toHaveBeenCalled()
        fetchSpy.mockRestore()
        errSpy.mockRestore()
    })

    it('updateButtonURL catch branch logs error if querySelector throws', () => {
        const event = makeEvent()
        const d = new Description(event)
        const orig = document.querySelector
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
(document as any).querySelector = vi.fn(() => { throw new Error('qs-fail') })
        try {
            d.updateButtonURL()
            expect(errSpy).toHaveBeenCalled()
        } finally {
            (document as any).querySelector = orig
            errSpy.mockRestore()
        }
    })
    it('Location.addLocationText and .text work', () => {
        const loc = new Location()
        const el = document.createElement('div')
        document.body.appendChild(el)
        loc.el = el
        loc.addLocationText('Jitsi Meeting')
        expect(loc.text).toBe('Jitsi Meeting')
    })

    it('update() uses location text containing LOCATION_TEXT to switch button to Join', () => {
        const event = makeEvent()
        const d = new Description(event)
        Object.defineProperty(d as any, 'element', { value: true })
        Object.defineProperty(d as any, 'value', { value: '' })
        const loc = new Location()
        const el = document.createElement('div')
        el.textContent = 'Some Jitsi Meeting here'
        loc.el = el
        const spyUpdate = vi.spyOn(d, 'updateButtonURL')
        d.update(loc as any)
        expect(spyUpdate).toHaveBeenCalled()
    })

    it('getInviteText appends dial-in numbers when template missing', () => {
        const event = makeEvent({ numbers: { US: '+1 111' } })
        const d = new Description(event)
        const txt = d.getInviteText()
        expect(txt).toContain('Just want to dial in on your phone?')
        expect(txt).toContain('US: +1 111')
    })

    it('clickAddMeeting(true) only updates button URL', async () => {
        const event = makeEvent()
        const d = new Description(event)
        const addSpy = vi.spyOn(d, 'addDescriptionText')
        const updSpy = vi.spyOn(d, 'updateButtonURL')
        await d.clickAddMeeting(true as any, {} as any)
        expect(addSpy).not.toHaveBeenCalled()
        expect(updSpy).toHaveBeenCalled()
    })

    it('base getters element/value return el and its value', () => {
        const d = new Description(makeEvent());
(d as any).el = { value: 'abc' }
        const el = (d as any).element
        expect(el).toBeDefined()
        expect(d.value).toBe('abc')
    })
})


