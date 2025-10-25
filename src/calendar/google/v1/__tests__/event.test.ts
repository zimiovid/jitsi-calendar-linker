import { describe, expect,it } from 'vitest'

import { BASE_URL, LOCATION_TEXT } from '@calendar/env'

import { Event } from '../event'

describe('google v1 event', () => {
    it('creates button container and calls update flow', () => {
        document.body.innerHTML = '<table class="ep-dp-dt"><tbody><tr id="abc.rtc-row"></tr></tbody></table><div id="abc.descript-row"><textarea></textarea></div>'
        const locLabel = document.createElement('div')
        locLabel.id = 'abc.location-label'
        document.body.appendChild(locLabel)
        // ensure visibility of the table
        const tbl = document.querySelector('table.ep-dp-dt') as HTMLElement;
(tbl as any).getClientRects = () => [{ left: 0, top: 0, width: 10, height: 10 }] as any
        Object.defineProperty(tbl, 'offsetWidth', { value: 10 })
        Object.defineProperty(tbl, 'offsetHeight', { value: 10 })
        const page = document.createElement('div')
        const ev = new Event(page)
        ev.update()
        const row = document.getElementById('abc.jitsi-rtc-row')
        expect(row).not.toBeNull()
        const td = (row as HTMLElement)?.querySelector('td.ep-dp-dt-td')
        expect(td).not.toBeNull()
    })

    it('updates description and location via adapters', () => {
        document.body.innerHTML = '<table class="ep-dp-dt"><tbody><tr id="abc.rtc-row"></tr></tbody></table>'
            + '<div id="abc.descript"><textarea></textarea></div>'
            + '<div id="abc.descript-row"><textarea></textarea></div>'
            + '<div id="abc.location-label"></div>'
            + '<div id="abc.location" class="ep-dp-input"><input value="" /></div>'
        const tbl = document.querySelector('table.ep-dp-dt') as HTMLElement;
(tbl as any).getClientRects = () => [{ left: 0, top: 0, width: 10, height: 10 }] as any
        Object.defineProperty(tbl, 'offsetWidth', { value: 10 })
        Object.defineProperty(tbl, 'offsetHeight', { value: 10 })
        const page = document.createElement('div')
        const ev = new Event(page)
        // call description.addDescriptionText
        ev.description.addDescriptionText('Hello')
        expect(ev.description.value).toContain('Hello')
        // call location.addLocationText
        ev.location.addLocationText('Jitsi Meeting')
        expect(ev.location.text).toContain('Jitsi Meeting')
    })

    it('updates button when description contains meeting link', () => {
        document.body.innerHTML = '<table class="ep-dp-dt"><tbody><tr id="abc.rtc-row"></tr></tbody></table>'
            + '<div id="abc.descript"><textarea></textarea></div>'
            + '<div id="abc.descript-row"><textarea></textarea></div>'
            + '<div id="abc.location-label"></div>'
        const tbl = document.querySelector('table.ep-dp-dt') as HTMLElement;
(tbl as any).getClientRects = () => [{ left: 0, top: 0, width: 10, height: 10 }] as any
        Object.defineProperty(tbl, 'offsetWidth', { value: 10 })
        Object.defineProperty(tbl, 'offsetHeight', { value: 10 })
        const ta = document.querySelector('#abc\\.descript textarea') as HTMLTextAreaElement
        ta.value = 'Some text ' + BASE_URL + 'roomabc more text'
        const page = document.createElement('div')
        const ev = new Event(page)
        ev.update()
        const a = document.querySelector('#jitsi_button a') as HTMLAnchorElement
        expect(a).not.toBeNull()
        expect(a.innerHTML).toBe('Join your ' + LOCATION_TEXT + ' now')
        expect(a.getAttribute('href')).toBe(BASE_URL + 'roomabc')
    })

    it('updates button when location contains LOCATION_TEXT', () => {
        document.body.innerHTML = '<table class="ep-dp-dt"><tbody><tr id="abc.rtc-row"></tr></tbody></table>'
            + '<div id="abc.descript-row"><textarea></textarea></div>'
            + '<div id="abc.location-label"></div>'
            + '<div id="abc.location" class="ep-dp-input"><input value="' + LOCATION_TEXT + '" /></div>'
        const tbl = document.querySelector('table.ep-dp-dt') as HTMLElement;
(tbl as any).getClientRects = () => [{ left: 0, top: 0, width: 10, height: 10 }] as any
        Object.defineProperty(tbl, 'offsetWidth', { value: 10 })
        Object.defineProperty(tbl, 'offsetHeight', { value: 10 })
        const page = document.createElement('div')
        const ev = new Event(page)
        ev.update()
        const a = document.querySelector('#jitsi_button a') as HTMLAnchorElement
        expect(a).not.toBeNull()
        expect(a.innerHTML).toBe('Join your ' + LOCATION_TEXT + ' now')
        expect((a.getAttribute('href') || '')).toContain(BASE_URL)
    })
})


