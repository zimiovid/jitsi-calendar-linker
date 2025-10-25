import { describe, expect, it } from 'vitest'

import { setConfig } from '../env'
import { tryAddMeetingInQuickDialog } from '../quickDialog'

function openQuickDialogSkeleton() {
  document.body.innerHTML = `
  <div role="dialog" jsname="ssXDle">
    <div data-key="description"></div>
    <button aria-expanded="false"></button>
  </div>`
}

describe('quickDialog', () => {
  it('returns null if no dialog', () => {
    document.body.innerHTML = ''
    expect(tryAddMeetingInQuickDialog()).toBe(null)
  })

  it('inserts url into existing editor and returns it', () => {
    setConfig({ domain: 'meet.test' })
    document.body.innerHTML = `
    <div role="dialog" jsname="ssXDle">
      <div class="editable" contenteditable="true"></div>
    </div>`
    const url = tryAddMeetingInQuickDialog()
    const ed = document.querySelector('.editable') as HTMLElement
    const text = ed.textContent || ''
    expect(text.startsWith('Click the following link to join the meeting from your computer: ')).toBe(true)
    expect(text).toMatch(/https:\/\/meet\.test\//)
    expect(url).toMatch(/https:\/\/meet\.test\//)
  })

  it('expands description when editor missing', () => {
    setConfig({ domain: 'meet.test' })
    openQuickDialogSkeleton()
    const url = tryAddMeetingInQuickDialog()
    expect(url).toMatch(/https:\/\/meet\.test\//)
  })

  it('inserts invite into Task textarea when Task tab selected', () => {
    setConfig({ domain: 'meet.test' })
    document.body.innerHTML = `
    <div role="dialog" jsname="ssXDle">
      <div role="tablist">
        <button id="tabEvent" role="tab" aria-selected="false"></button>
        <button id="tabTask" role="tab" aria-selected="true"></button>
      </div>
      <div role="tabpanel" aria-labelledby="tabTask" data-tab-type="5">
        <textarea jsname="YPqjbf" rows="3" id="c98" class="Fgl6fe-fmcmS-wGMbrd" aria-label="Добавьте описание"></textarea>
      </div>
    </div>`

    const url = tryAddMeetingInQuickDialog()
    const ta = document.querySelector('textarea[jsname="YPqjbf"]') as HTMLTextAreaElement
    expect(ta.value.startsWith('Click the following link to join the meeting from your computer: ')).toBe(true)
    expect(ta.value).toMatch(/https:\/\/meet\.test\//)
    expect(url).toMatch(/https:\/\/meet\.test\//)
  })

  it('dispatches input event even without InputEvent (fallback)', () => {
    setConfig({ domain: 'meet.test' })
    const original = (window as any).InputEvent;
(window as any).InputEvent = undefined
    try {
      document.body.innerHTML = `
    <div role="dialog" jsname="ssXDle">
      <div role="tablist">
        <button id="tabEvent" role="tab" aria-selected="false"></button>
        <button id="tabTask" role="tab" aria-selected="true"></button>
      </div>
      <div role="tabpanel" aria-labelledby="tabTask" data-tab-type="5">
        <textarea jsname="YPqjbf"></textarea>
      </div>
    </div>`
      const ta = document.querySelector('textarea[jsname="YPqjbf"]') as HTMLTextAreaElement
      let fired = 0
      ta.addEventListener('input', () => { fired += 1 })
      tryAddMeetingInQuickDialog()
      expect(fired).toBeGreaterThan(0)
    } finally {
      ; (window as any).InputEvent = original
    }
  })
})


