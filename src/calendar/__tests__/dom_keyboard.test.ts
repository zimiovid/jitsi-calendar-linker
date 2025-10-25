import { describe, expect, it, vi } from 'vitest'

import { getKeyboardEvent } from '../dom'

describe('getKeyboardEvent fallbacks', () => {
    it('uses legacy initKeyboardEvent when modern constructor is unavailable', () => {
        const originalKeyboardEvent = (globalThis as any).KeyboardEvent;
(globalThis as any).KeyboardEvent = function () { throw new Error('no modern') } as any
        const originalCreateEvent = document.createEvent
        const initSpy = vi.fn();
(document as any).createEvent = vi.fn(() => ({ initKeyboardEvent: initSpy }))
        try {
            const ev = getKeyboardEvent('keydown')
            expect(ev).toBeDefined()
            expect(initSpy).toHaveBeenCalled()
        } finally {
            ; (globalThis as any).KeyboardEvent = originalKeyboardEvent;
(document as any).createEvent = originalCreateEvent
        }
    })

    it('uses legacy initKeyEvent when initKeyboardEvent is unavailable', () => {
        const originalKeyboardEvent = (globalThis as any).KeyboardEvent;
(globalThis as any).KeyboardEvent = function () { throw new Error('no modern') } as any
        const originalCreateEvent = document.createEvent
        const initSpy = vi.fn();
(document as any).createEvent = vi.fn(() => ({ initKeyEvent: initSpy }))
        try {
            const ev = getKeyboardEvent('keyup')
            expect(ev).toBeDefined()
            expect(initSpy).toHaveBeenCalled()
        } finally {
            ; (globalThis as any).KeyboardEvent = originalKeyboardEvent;
(document as any).createEvent = originalCreateEvent
        }
    })
})



