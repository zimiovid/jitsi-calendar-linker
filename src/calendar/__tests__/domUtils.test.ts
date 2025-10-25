import { describe, expect,it } from 'vitest'

import { createNodeFromHTML,isVisible } from '../domUtils'

describe('domUtils', () => {
    it('createNodeFromHTML creates node tree', () => {
        const el = createNodeFromHTML('<div><span id="x">a</span></div>')
        expect(el.querySelector('#x')!.textContent).toBe('a')
    })

    it('isVisible false for null/hidden', () => {
        expect(isVisible(null)).toBe(false)
        const el = document.createElement('div')
        el.style.display = 'none'
        document.body.appendChild(el)
        expect(isVisible(el)).toBe(false)
    })

    it('isVisible true for normal element', () => {
        const el = document.createElement('div')
        el.textContent = 'hi'
        // jsdom does not compute layout, mock size to simulate visibility
        Object.defineProperty(el, 'offsetWidth', { value: 10 })
        Object.defineProperty(el, 'offsetHeight', { value: 10 })
        document.body.appendChild(el)
        expect(isVisible(el)).toBe(true)
    })
})


