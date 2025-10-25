import { randomDigitString } from '@/util/randomUtil'
import { generateRoomWithoutSeparator } from '@/util/roomNameGenerator'

import { BASE_URL, generateRoomNameAsDigits } from './env'

function getQuickInviteText(url: string): string {
    // Required quick-form invite text per product requirement
    return 'Click the following link to join the meeting from your computer: ' + url
}

export function tryAddMeetingInQuickDialog(): string | null {
    const dialog = document.querySelector('div[role="dialog"][jsname="ssXDle"]') as HTMLElement | null
    if (!dialog) { return null }
    // Allow work in both Event and Task forms

    const meetingId = generateRoomNameAsDigits ? randomDigitString(10) : generateRoomWithoutSeparator()
    const url = BASE_URL + meetingId

    const findEditor = (): HTMLElement | null => {
        // Prefer active Task description textarea if Task tab is selected
        const taskPanel = dialog.querySelector('[role="tabpanel"][aria-labelledby="tabTask"][data-tab-type="5"]') as HTMLElement | null
        const isTaskActive = !!dialog.querySelector('#tabTask[aria-selected="true"]')
        if (isTaskActive && taskPanel) {
            const taskTextarea = taskPanel.querySelector('textarea[jsname="YPqjbf"]') as HTMLTextAreaElement | null
            if (taskTextarea) { return taskTextarea }
        }
        // Fallback to Event rich editor

        return dialog.querySelector('.editable[contenteditable="true"]') as HTMLElement | null
    }

    const ensureDescriptionExpanded = () => {
        const descKey = dialog.querySelector('[data-key="description"]') as HTMLElement | null
        const btn = descKey ? (descKey.closest('button') as HTMLElement | null) : null
        if (btn && btn.getAttribute('aria-expanded') !== 'true') { btn.click() }
    }

    const insertUrl = (ed: HTMLElement) => {
        ed.focus()
        if (ed instanceof HTMLTextAreaElement) {
            ed.value = getQuickInviteText(url)
        } else {
            ed.textContent = getQuickInviteText(url)
        }
        if (typeof (window as any).InputEvent === 'function') {
            ed.dispatchEvent(new (window as any).InputEvent('input', { bubbles: true }))
        } else {
            ed.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
        }
    }

    const editorNow = findEditor()
    if (editorNow) {
        insertUrl(editorNow)

        return url
    }

    ensureDescriptionExpanded()

    let attempts = 10
    const tryLater = () => {
        const ed = findEditor()
        if (ed) {
            insertUrl(ed)

            return
        }
        attempts -= 1
        if (attempts > 0) { setTimeout(tryLater, 80) }
    }
    setTimeout(tryLater, 80)

    return url
}


