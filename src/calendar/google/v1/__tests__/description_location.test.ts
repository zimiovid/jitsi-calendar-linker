import { describe, expect, it } from 'vitest'

import { Description } from '../description'
import { GLocation } from '../location'

describe('google v1 adapters', () => {
    it('Description.addDescriptionText clicks non-textarea and switches to textarea', () => {
        document.body.innerHTML = ''
        // prefix for getNodeID
        const label = document.createElement('div')
        label.id = 'abc.location-label'
        document.body.appendChild(label)
        // container for description
        const container = document.createElement('div')
        container.id = 'abc.descript'
        const level1 = document.createElement('div')
        const level2 = document.createElement('div')
        const fallback = document.createElement('div') as any
        fallback.innerHTML = 'initial'
        fallback.click = () => {
            const taWrap = document.createElement('div')
            const ta = document.createElement('textarea')
            taWrap.appendChild(ta)
            // place textarea inside #abc.descript
            container.appendChild(taWrap)
        }
        level2.appendChild(fallback)
        level1.appendChild(level2)
        container.appendChild(level1)
        document.body.appendChild(container)

        const d = new Description({} as any)
        d.addDescriptionText('Hello')
        const ta = container.querySelector('textarea') as HTMLTextAreaElement
        expect(ta).toBeTruthy()
        expect(ta.value).toContain('Hello')
    })

    it('GLocation.addLocationText clicks display and fills input', () => {
        document.body.innerHTML = ''
        const displayContainer = document.createElement('div')
        displayContainer.className = 'ep-dp-input'
        const inner = document.createElement('div')
        const inner2 = document.createElement('div') as any
        inner.appendChild(inner2)
        displayContainer.appendChild(inner);
        (displayContainer as any).id = 'abc.location'
        document.body.appendChild(displayContainer);

        // clicking display creates input
        (inner2 as any).click = () => {
            const inpWrap = document.createElement('div')
            const input = document.createElement('input')
            inpWrap.appendChild(input)
            displayContainer.appendChild(inpWrap)
        }

        const loc = new GLocation()
        loc.addLocationText('Jitsi')
        const input = displayContainer.querySelector('input') as HTMLInputElement
        expect(input).toBeTruthy()
        expect(input.value).toContain('Jitsi')
    })
})


