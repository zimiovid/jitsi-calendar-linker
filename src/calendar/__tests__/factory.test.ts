import { describe, expect, it, vi } from 'vitest'

import { getEventContainerInstance } from '../factory'

// Mock HTML import used by google/v2/event
vi.mock('@templates/_buttonContainer.html', () => ({ default: '<div></div>' }))

describe('factory', () => {
    it('returns undefined when not on event page', () => {
        document.body.innerHTML = '<body></body>'
        expect(getEventContainerInstance()).toBeUndefined()
    })

    it('returns V1 instance when edit page present', () => {
        document.body.innerHTML = '<div id="maincell"><div id="coverinner"></div></div>'
        const inst = getEventContainerInstance()
        expect(inst).not.toBeUndefined()
    })

    it('returns V2 instance when body dataset present', () => {
        document.body.innerHTML = '<body data-viewfamily="EVENT"></body>'
        const body = document.querySelector('body') as HTMLElement;
(body as any).dataset.viewfamily = 'EVENT'
        const inst = getEventContainerInstance()
        expect(inst).not.toBeUndefined()
    })
})


