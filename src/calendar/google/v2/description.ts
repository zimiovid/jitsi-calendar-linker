import { Description as BaseDescription } from "@calendar/description"
import { getKeyboardEvent } from "@calendar/dom"
import { BASE_URL,LOCATION_TEXT } from "@calendar/env"

export class Description extends BaseDescription {
    get element() {
        let description: HTMLElement | null = document.querySelector('#xDescIn > [role="textbox"]')
        if (!description) {
            description = document.querySelector('#xDesc > div');
            (description as any).notEditable = true
        }

        return description
    }
    get value() {
        const el = (this as any).element as HTMLElement | null
        if (!el) { return '' }

        return el.textContent || ''
    }
    addDescriptionText(text: string) {
        const el = (this as any).element as HTMLElement & { notEditable?: boolean }
        if (el.notEditable) { return }
        const descriptionNode = el as HTMLElement
        descriptionNode.dispatchEvent(getKeyboardEvent('keydown'))
        descriptionNode.dispatchEvent(getKeyboardEvent('keypress'))
        const textToInsert = text.replace(/(?:\r\n|\r|\n)/g, '<br />')
        if ((el.textContent || '').length > 0) {
            el.insertAdjacentHTML('beforeend', '<br/><br/>')
        }
        el.insertAdjacentHTML('beforeend', textToInsert)
        descriptionNode.dispatchEvent(getKeyboardEvent('input'))
        descriptionNode.dispatchEvent(getKeyboardEvent('keyup'))
    }
    updateInitialButtonURL(location: any) {
        const button = document.querySelector('#jitsi_button') as HTMLElement | null
        if (!button) { return }
        button.innerHTML = 'Add a ' + LOCATION_TEXT
        const container = (this.event as any).buttonContainer as HTMLElement | null
        if (!container) { return }
        let parent = container.parentElement
        if (!parent) { return }
        parent.replaceWith(parent.cloneNode(true))
        parent = (this.event as any).buttonContainer.parentElement
        parent?.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault()
            this.clickAddMeeting(false, location)
        })
    }
    updateButtonURL() {
        try {
            const button = document.querySelector('#jitsi_button') as HTMLElement | null
            if (!button) { return }
            button.innerHTML = "Join your " + LOCATION_TEXT + " now"
            const container = (this.event as any).buttonContainer as HTMLElement | null
            if (!container) { return }
            let parent = container.parentElement as HTMLElement | null
            if (!parent) { return }
            parent.replaceWith(parent.cloneNode(true))
            parent = (this.event as any).buttonContainer.parentElement
            parent?.addEventListener('click', (e: MouseEvent) => {
                e.preventDefault();
                (this.event as any).updateMeetingId()
                window.open(BASE_URL + (this.event as any).meetingId, '_blank')
            })
        } catch (e) {
            console.log(e)
        }
    }
}