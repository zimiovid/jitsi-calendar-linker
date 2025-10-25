import { BASE_DOMAIN,BASE_URL, CONFERENCE_MAPPER_SCRIPT, LOCATION_TEXT } from "./env"
import { EventContainer } from "./event"
import type { Location } from "./location"

/**
 * Abstraction over event description field: reads/updates content
 * and composes invite text based on runtime configuration.
 */
export class Description {
    event: EventContainer
    el: HTMLTextAreaElement | { value?: string; noTextArea?: boolean; click?: () => void } | null = null
    /** Creates description binder for specific event container. */
    constructor(event: EventContainer) { this.event = event }
    /** Recomputes button/link depending on description/location contents. */
    update(location: Location) {
        let isDescriptionUpdated = false
        if ((this as any).element !== undefined) {
            const descriptionContainsURL =
                ((this as any).value
                    && (this as any).value.length >= 1
                    && (this as any).value.indexOf(BASE_URL) !== -1)
            isDescriptionUpdated =
                descriptionContainsURL
                || (location !== null
                    && location.text
                    && location.text.indexOf(LOCATION_TEXT) !== -1)
        }
        if (isDescriptionUpdated) {
            this.updateButtonURL()
        } else {
            this.updateInitialButtonURL(location)
        }
    }
    /** Appends invite text and updates button link (mapper/dial-in supported). */
    async clickAddMeeting(isDescriptionUpdated: boolean, _location: Location) {
        if (!isDescriptionUpdated) {
            try {
                if (CONFERENCE_MAPPER_SCRIPT) {
                    await fetch(CONFERENCE_MAPPER_SCRIPT + "?conference=" + (this.event as any).meetingId + "@conference." + BASE_DOMAIN)
                        .then(r => r.json())
                        .then(jsonobj => {
                            if (jsonobj.conference && jsonobj.id) {
                                this.addDescriptionText(this.getInviteText(jsonobj.id))
                            } else {
                                this.addDescriptionText(this.getInviteText())
                            }
                        })
                } else {
                    this.addDescriptionText(this.getInviteText())
                }
            } catch (err) {
                console.error('[description] mapper fetch failed', err)
                this.addDescriptionText(this.getInviteText())
            }
            this.updateButtonURL()
        } else {
            this.updateButtonURL()
        }
    }
    get element(): typeof this.el { return this.el }
    get value(): string | undefined { return (this.el && (this.el as any).value) ? (this.el as any).value as string : undefined }
    /** Appends text to description (implemented by concrete UIs). */
    addDescriptionText(_text: string): void { }
    /** Builds invite text using templates and optional dial-in id. */
    getInviteText(dialInID?: string): string {
        let inviteText: string
        let hasTemplate = false
        if ((this.event as any).inviteTextTemplate) {
            inviteText = (this.event as any).inviteTextTemplate
            hasTemplate = true
        } else {
            inviteText =
                "Click the following link to join the meeting " +
                "from your computer: " + BASE_URL + (this.event as any).meetingId
        }
        if ((this.event as any).numbers && Object.keys((this.event as any).numbers).length > 0) {
            if ((this.event as any).inviteNumbersTextTemplate) {
                inviteText += (this.event as any).inviteNumbersTextTemplate
                hasTemplate = true
                Object.keys((this.event as any).numbers).forEach(key => {
                    const value = (this.event as any).numbers[key]
                    inviteText = inviteText.replace('{' + key + '}', key + ": " + value)
                })
            } else {
                inviteText += "\n\n====="
                inviteText += "\n\nJust want to dial in on your phone? "
                inviteText += " \n\nCall one of the following numbers: "
                Object.keys((this.event as any).numbers).forEach(key => {
                    const value = (this.event as any).numbers[key]
                    inviteText += "\n" + key + ": " + value
                })
                inviteText += "\n\nSay your conference name: '"
                    + (this.event as any).meetingId
                    + "' and you will be connected!"
            }
        }
        if (hasTemplate) {
            inviteText = inviteText.replace(/\{BASE_URL\}/g, BASE_URL)
            inviteText = inviteText.replace(/\{MEETING_ID\}/g, (this.event as any).meetingId)
            if (dialInID) {
                inviteText = inviteText.replace(/\{DIALIN_ID\}/g, dialInID)
            }
        }

        return inviteText
    }
    updateInitialButtonURL(location: any) {
        const anchor = document.querySelector('#jitsi_button a') as HTMLAnchorElement | null
        if (!anchor) { return }
        anchor.innerHTML = 'Add a ' + LOCATION_TEXT
        anchor.setAttribute('href', '#')
        anchor.onclick = (e: any) => {
            e.preventDefault()
            this.clickAddMeeting(false, location)
        }
    }
    updateButtonURL() {
        try {
            let anchor = document.querySelector('#jitsi_button a') as HTMLAnchorElement | null
            if (!anchor) { return }
            anchor.innerHTML = "Join your " + LOCATION_TEXT + " now"
            anchor.replaceWith(anchor.cloneNode(true))
            anchor = document.querySelector('#jitsi_button a')
            if (!anchor) { return }
            (anchor as any).setAttribute('href', BASE_URL + (this.event as any).meetingId);
            (anchor as any).setAttribute('target', '_new')
        } catch (e) {
            console.error('[description] updateButtonURL failed', e)
        }
    }
}