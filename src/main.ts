// moved from content.ts
import './util/randomUtil'
import './util/roomNameGenerator'

import { createNodeFromHTML, findGetParameter, getEventContainerInstance, LOCATION_TEXT, setConfig as setEnvConfig } from './calendar'
import { tryAddMeetingInQuickDialog } from './calendar/quickDialog'
// keep random/imports local in quickDialog
import { getConfig } from './config/config'
// @ts-ignore
import g2QuickAddContentTpl from './templates/_g2QuickAddContent.html'
// @ts-ignore
import quickAddTpl from './templates/_quickAddButton.html'

function isG2View(): boolean {
    const body = document.querySelector('body') as any

    return !!body?.dataset?.viewfamily
}

function createG2QuickAdd(): HTMLElement {
    const el = createNodeFromHTML(g2QuickAddContentTpl as string)
    const textNode = el.querySelector('.jitsi_quick_add_text_size') as HTMLElement | null
    if (textNode) { textNode.textContent = 'Add a ' + LOCATION_TEXT }

    return el
}

function attachG2QuickAdd(parent: HTMLElement, container: any) {
    const quick = createG2QuickAdd()
    parent.appendChild(quick)
    // Show button for both Event and Task tabs; we control behavior in quickDialog
    const tabEvent = parent.querySelector('#tabEvent') as HTMLElement | null
    const tabTask = parent.querySelector('#tabTask') as HTMLElement | null
    const contentEl = quick.querySelector('#jitsi_button_quick_add_content') as HTMLElement | null
    const updateVisibility = () => {
        if (!contentEl) { return }
        // Re-query active tab each time (tabs may be re-rendered/replaced)
        let isEventSelected = !!parent.querySelector('#tabEvent[aria-selected="true"]')
        // Fallback: check visibility of tabpanel linked to Event
        if (!isEventSelected) {
            const eventPanel = parent.parentElement?.querySelector('[role="tabpanel"][aria-labelledby="tabEvent"]') as HTMLElement | null
            if (eventPanel) {
                const cs = window.getComputedStyle(eventPanel)
                isEventSelected = (cs && cs.display !== 'none' && cs.visibility !== 'hidden')
            }
        }
        // Visible for both tabs now
        contentEl.style.display = 'flex'
    }
    updateVisibility();
    [tabEvent, tabTask].forEach((tab) => {
        if (!tab) { return }
        tab.addEventListener('click', () => setTimeout(updateVisibility, 0))
    })
    // Observe the tab container for subtree changes and aria-selected toggles
    const MutationObserverVar = (window.MutationObserver ?? (window as any).WebKitMutationObserver) as unknown as typeof MutationObserver
    new MutationObserverVar(() => updateVisibility())
        .observe(parent, { attributes: true, childList: true, subtree: true, attributeFilter: ['aria-selected'] })
    const handler = quick.querySelector('#jitsi_button_quick_add') as HTMLElement | null
    if (!handler) { return }
    handler.addEventListener('click', function () {
        const url = tryAddMeetingInQuickDialog()
        if (url) {
            const label = quick.querySelector('.jitsi_quick_add_text_size') as HTMLElement | null
            if (label) { label.textContent = 'Join your Jitsi Meeting now' }

            const btnEl = quick.querySelector('#jitsi_button_quick_add') as HTMLElement | null
            if (btnEl) {
                btnEl.setAttribute('data-url', url)
                btnEl.addEventListener('click', function (e) {
                    e.preventDefault()
                    const targetUrl = (btnEl.getAttribute('data-url') || '').trim()
                    if (targetUrl) { window.open(targetUrl, '_blank') }
                }, { once: true })
            }

            return
        }

        container.scheduleAutoCreateMeeting = true
        const btn = document.querySelector('div[role="button"][jsname="rhPddf"]') as HTMLElement | null
        if (btn) { btn.click() }
    })
}

// moved to calendar/quickDialog

function handleClassicQuickAdd(container: any) {
    const quickAddDialogContainer = document.querySelector('.bubblecontent .event-create-container')
    if (!quickAddDialogContainer || document.querySelector('#jitsi_button_quick_add')) { return }

    const buttonsRow = document.querySelector('.bubblecontent .event-create-container > .action-tile') as HTMLElement | null
    if (!buttonsRow) { return }

    const numberOfButtons = buttonsRow.querySelectorAll('.split-tile-right').length
    const lastButtonGroup = buttonsRow.querySelector('.split-tile-right:last-child')
    const jitsiQuickAddButton = createNodeFromHTML(quickAddTpl as string)
    const qa = jitsiQuickAddButton.querySelector('#jitsi_button_quick_add') as HTMLElement | null
    if (qa) {
        qa.textContent = 'Add a ' + LOCATION_TEXT;
        (qa as HTMLElement).style.left = (numberOfButtons > 1 ? '10px' : '0px')
    }
    if (lastButtonGroup && (lastButtonGroup as any).parentNode) {
        ; (lastButtonGroup as any).parentNode.insertBefore(jitsiQuickAddButton, lastButtonGroup)
    }
    const clickEl = jitsiQuickAddButton.querySelector('#jitsi_button_quick_add') as HTMLElement | null
    if (!clickEl) { return }
    clickEl.addEventListener('click', function () {
        container.scheduleAutoCreateMeeting = true
        const editBtn = document.querySelector('div.edit-button') as HTMLElement | null
        if (editBtn) { editBtn.click() }
    })
}

function checkAndUpdateCalendar() {
    const MutationObserverVar = (window.MutationObserver ?? (window as any).WebKitMutationObserver) as unknown as typeof MutationObserver
    const c = getEventContainerInstance()
    if (c) {
        new MutationObserverVar(function () {
            try {
                (c as any).update()
            } catch (e) {
                console.log(e)
            }
        }).observe((c as any).container as Node, { childList: true, attributes: true, characterData: false })

        if (!(c as any).isButtonPresent()) {
            if (findGetParameter('autoCreateMeeting') && findGetParameter('extid') === (chrome as any).runtime.id) {
                (c as any).scheduleAutoCreateMeeting = true
            }
            (c as any).update()
        }

        const body = document.querySelector('body') as HTMLElement | null
        if (!body) { return }
        new MutationObserverVar(function () {
            const quickAddDialog = document.querySelector('.bubble')
            if (quickAddDialog) {
                setTimeout(function () {
                    handleClassicQuickAdd(c)
                }, 100)
            }
        }).observe(body, { attributes: false, childList: true, characterData: false })
    }
}

function checkAndUpdateCalendarG2() {
    const MutationObserverVar = (window.MutationObserver ?? (window as any).WebKitMutationObserver) as unknown as typeof MutationObserver
    const c = getEventContainerInstance()
    if (c) {
        const body = document.querySelector('body') as HTMLElement | null
        if ((body as any).dataset.viewfamily === 'EVENT_EDIT' && !(c as any).isButtonPresent()) {
            if (findGetParameter('autoCreateMeeting') && findGetParameter('extid') === (chrome as any).runtime.id) {
                (c as any).scheduleAutoCreateMeeting = true
            }
            (c as any).update()
        }
        if (!body) { return }
        new MutationObserverVar(function (mutations: MutationRecord[]) {
            if (isG2View() && ((document.querySelector('body') as any).dataset.viewfamily === 'EVENT')) {
                mutations.forEach(function (mutation: MutationRecord) {
                    const mel = mutation.addedNodes[0] as HTMLElement | undefined
                    const newElement = mel && (mel as any).outerHTML as string | undefined
                    if (newElement && (newElement.indexOf('role="dialog"') !== -1)) {
                        if (document.querySelector('#jitsi_button_quick_add')) { return }
                        const tabEvent = mel && (mel as any).querySelector && (mel as any).querySelector('#tabEvent')
                        if (tabEvent) {
                            const tablist = (tabEvent as HTMLElement).closest('[role="tablist"]') as HTMLElement | null
                            if (tablist) { attachG2QuickAdd(tablist, c) }

                            return
                        }
                    }
                })
            } else if ((document.querySelector('body') as any).dataset.viewfamily === 'EVENT_EDIT') {
                (c as any).update()
            }
        }).observe(body, { attributes: false, childList: true, characterData: false, subtree: true })
    }
}

export function initMeet() {
    if ((document.querySelector('body') as any).dataset.viewfamily) {
        checkAndUpdateCalendarG2()
    } else {
        checkAndUpdateCalendar()
    }
}

getConfig(async (cfg) => {
    try {
        setEnvConfig(cfg)
        initMeet()
    } catch (err) {
        console.error('[content] init failed', err)
    }
})


