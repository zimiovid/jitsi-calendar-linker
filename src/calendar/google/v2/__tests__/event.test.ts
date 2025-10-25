import { describe, expect, it, vi } from 'vitest'
vi.mock('../../../../templates/_buttonContainer.html', () => ({ default: '<div id="jitsi_button_container"><content></content></div>' }))
import { Event } from '../event'

describe('google v2 event', () => {
    it('injects container and triggers description update', () => {
        document.body.innerHTML = '<div id="xNtList"></div><div id="xLocIn"></div><div id="xDesc"><div contenteditable="true" role="textbox"></div></div>'
        const page = document.createElement('div')
        const ev = new Event(page)
        ev.update()
        expect(document.querySelector('#jitsi_button_container')).not.toBeNull()
    })
})


