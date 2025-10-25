import { describe, expect, it } from 'vitest'

import { findGetParameter, getNodeID, getNodePrefix } from '../dom'

describe('dom helpers', () => {
    it('findGetParameter returns decoded value or null', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('https://example.com/?x=1&name=John%20Doe'),
            writable: true
        })
        expect(findGetParameter('x')).toBe('1')
        expect(findGetParameter('name')).toBe('John Doe')
        expect(findGetParameter('missing')).toBe(null)
        Object.defineProperty(window, 'location', { value: new URL('https://example.com/'), writable: true })
    })

    it('getNodePrefix reads id prefix and getNodeID composes selector', () => {
        const el = document.createElement('div')
        el.id = 'abc.location-label'
        document.body.appendChild(el)
        expect(getNodePrefix()).toBe('abc')
        expect(getNodeID('row')).toBe('#abc\\.row')
    })
})


