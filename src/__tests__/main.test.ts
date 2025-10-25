import { beforeEach,describe, expect, it, vi } from 'vitest'

// Mock HTML assets used inside main
vi.mock('../templates/_g2QuickAddContent.html', () => ({ default: '<div id="jitsi_button_quick_add"><span class="jitsi_quick_add_text_size"></span></div>' }))
vi.mock('../templates/_quickAddButton.html', () => ({ default: '<div id="jitsi_button_quick_add"></div>' }))

// Mock calendar barrel
const updateSpy = vi.fn()
vi.mock('../calendar', () => {
    const container = document.createElement('div')

    return {
        LOCATION_TEXT: 'Jitsi Meeting',
        setConfig: vi.fn(),
        findGetParameter: vi.fn(),
        createNodeFromHTML: (html: string) => {
            const div = document.createElement('div')
            div.innerHTML = html

            return div.firstElementChild as HTMLElement
        },
        getEventContainerInstance: () => ({ container, update: updateSpy, isButtonPresent: () => false })
    }
})

// Mock MutationObserver to capture observe targets
class MockMO {
    static last: { target: Node, options: MutationObserverInit } | null = null
    constructor(_cb: MutationCallback) { }
    observe(target: Node, options: MutationObserverInit) { MockMO.last = { target, options } }
    disconnect() { }
    takeRecords(): MutationRecord[] { return [] }
}
(globalThis as any).MutationObserver = MockMO as any

describe('main.initMeet', () => {
    beforeEach(() => { document.body.innerHTML = ''; updateSpy.mockClear(); (MockMO as any).last = null })

    it('classic path observes container', async () => {
        // ensure classic (no dataset.viewfamily)
        const mod = await import('../main')
        mod.initMeet()
        expect(MockMO.last!.target).toBeDefined()
    })

    it('g2 path observes body subtree', async () => {
        Object.defineProperty(document.body, 'dataset', { value: { viewfamily: 'EVENT' } })
        const mod = await import('../main')
        mod.initMeet()
        expect(MockMO.last!.target).toBe(document.querySelector('body'))
        expect((MockMO.last!.options as any).subtree || false).toBe(true)
    })
})


