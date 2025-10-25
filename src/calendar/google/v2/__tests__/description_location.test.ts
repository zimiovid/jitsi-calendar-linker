import { describe, expect, it, vi } from 'vitest'

import { BASE_URL } from '../../../env'
import { Description } from '../description'
import { Location } from '../location'

describe('google v2 adapters', () => {
    it('Description.addDescriptionText respects notEditable and inserts with <br/>', () => {
        document.body.innerHTML = ''
        const xDesc = document.createElement('div')
        xDesc.id = 'xDesc'
        const div = document.createElement('div')
        xDesc.appendChild(div)
        document.body.appendChild(xDesc)
        const d = new Description({} as any)
        // notEditable path
        d.addDescriptionText('A')
        expect(div.innerHTML).toBe('')

        // make editable via xDescIn
        xDesc.id = ''
        const xDescIn = document.createElement('div')
        xDescIn.id = 'xDescIn'
        const box = document.createElement('div')
        box.setAttribute('role', 'textbox')
        xDescIn.appendChild(box)
        document.body.appendChild(xDescIn)
        const d2 = new Description({} as any)
        d2.addDescriptionText('Line1')
        d2.addDescriptionText('Line2')
        expect(box.innerHTML).toBe('Line1<br><br>Line2')
    })

    it('Location.addLocationText writes to combobox and triggers input twice', async () => {
        document.body.innerHTML = ''
        const xLocIn = document.createElement('div')
        xLocIn.id = 'xLocIn'
        const input = document.createElement('input')
        input.setAttribute('jsname', 'YPqjbf')
        input.setAttribute('role', 'combobox')
        xLocIn.appendChild(input)
        document.body.appendChild(xLocIn)
        const loc = new Location()
        vi.useFakeTimers()
        let fired = 0
        input.addEventListener('input', () => { fired += 1 })
        loc.addLocationText('X')
        expect(input.value).toContain('X')
        vi.runOnlyPendingTimers()
        expect(fired).toBeGreaterThanOrEqual(2)
        vi.useRealTimers()
    })

    it('Location.text falls back to #xOnCal innerHTML when combobox missing', () => {
        document.body.innerHTML = ''
        const xOnCal = document.createElement('div')
        xOnCal.id = 'xOnCal'
        xOnCal.innerHTML = 'Some Place'
        document.body.appendChild(xOnCal)
        const loc = new Location()
        expect(loc.text).toBe('Some Place')
    })

    it('Description.updateInitialButtonURL wires parent click to clickAddMeeting(false, location)', () => {
        document.body.innerHTML = '<div id="jitsi_button"></div>'
        const parent = document.createElement('div')
        const container = document.createElement('div')
        parent.appendChild(container)
        const event = { buttonContainer: container } as any
        const d = new Description(event)
        const loc: any = {}
        const spy = vi.spyOn(d, 'clickAddMeeting').mockImplementation(async () => { })
        d.updateInitialButtonURL(loc)
        parent.click()
        expect(spy).toHaveBeenCalledWith(false, loc)
    })

    it('Description.updateButtonURL sets label and opens BASE_URL + meetingId on click', () => {
        document.body.innerHTML = '<div id="jitsi_button"></div>'
        const parent = document.createElement('div')
        const container = document.createElement('div')
        parent.appendChild(container)
        const event = { buttonContainer: container, updateMeetingId: vi.fn(), meetingId: 'room123' } as any
        const d = new Description(event)
        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementation(() => null as any)
        d.updateButtonURL()
        parent.click()
        expect(event.updateMeetingId).toHaveBeenCalled()
        expect(openSpy).toHaveBeenCalled()
        const url = (openSpy.mock.calls[0][0] as string)
        expect(url.startsWith(BASE_URL)).toBe(true)
        expect(url).toContain('room123')
        openSpy.mockRestore()
    })
})


