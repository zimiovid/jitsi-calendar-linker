import { randomDigitString } from "@/util/randomUtil"
import { generateRoomWithoutSeparator } from "@/util/roomNameGenerator"
import { Description } from '@calendar/description'
import { createNodeFromHTML } from "@calendar/domUtils"
import { BASE_URL, generateRoomNameAsDigits, NUMBER_RETRIEVE_SCRIPT } from "@calendar/env"

/**
 * Core event container abstraction for Calendar UI.
 * Holds shared state (meetingId, description/location instances)
 * and provides helpers to compute meeting link and inject UI.
 */
export class EventContainer {
    numbers: Record<string, string> = {}
    scheduleAutoCreateMeeting = false
    containerElement: HTMLElement | null = null
    descriptionInstance: Description | null = null
    locationInstance: Location | null = null
    meetingId!: string
    inviteTextTemplate?: string
    inviteNumbersTextTemplate?: string

    // Factory moved to calendar/factory.ts to avoid circular deps

    get description(): Description { return (this as any).descriptionInstance }
    get buttonContainer(): HTMLElement | null { return (this as any).buttonContainerInstance }
    get location(): Location { return (this as any).locationInstance }

    get container(): HTMLElement | null {
        return this.containerElement
    };

    set container(c: HTMLElement | null) {
        this.containerElement = c
    };

    /**
     * Triggers incremental UI update (implemented in concrete UIs).
     */
    update() { }

    /**
     * Checks whether the Jitsi button was already inserted.
     */
    isButtonPresent() {
        return (document.querySelectorAll('#jitsi_button').length >= 1)
    }

    /**
     * Resets cached description/location instances so they will be re-resolved.
     */
    reset() {
        this.descriptionInstance = null
        this.locationInstance = null
    }

    /**
     * Computes or reuses meetingId from description/location or generates a new one.
     */
    updateMeetingId(): void {
        if (!this.isButtonPresent()) {
            this.reset()
        }

        const inviteText = this.getInviteText()
        const existing = inviteText ? this.extractMeetingId(inviteText) : null
        if (existing) {
            ; (this as any).meetingId = existing

            return
        }

        this.setGeneratedMeetingId()
        this.maybeFetchNumbersAndAutoCreate()
    }

    private getInviteText(): string | undefined {
        const textFromLocation = (this as any).location?.text as string | undefined
        if (textFromLocation) {return textFromLocation}

        return (this as any).description?.value as string | undefined
    }

    private extractMeetingId(text: string): string | null {
        const ix = text.indexOf(BASE_URL)
        if (ix === -1) {return null}
        const url = text.substring(ix)
        let resMeetingId = url.substring(BASE_URL.length)
        const match = /([a-zA-Z]+).*/g.exec(resMeetingId)
        if (match && match[1]) { resMeetingId = match[1] }

        return resMeetingId
    }

    private setGeneratedMeetingId(): void {
        ; (this as any).meetingId = generateRoomNameAsDigits
            ? randomDigitString(10)
            : generateRoomWithoutSeparator()
    }

    private maybeFetchNumbersAndAutoCreate(): void {
        if (!NUMBER_RETRIEVE_SCRIPT) {
            if (this.scheduleAutoCreateMeeting) {
                ; (this as any).description?.clickAddMeeting(false, (this as any).location)
                this.scheduleAutoCreateMeeting = false
            }

            return
        }

        fetch(NUMBER_RETRIEVE_SCRIPT as any)
            .then(r => r.json())
            .then(jsonobj => {
                ; (this as any).inviteTextTemplate = jsonobj.inviteTextTemplate
                if (jsonobj.roomNameDictionary) {
                    ; (this as any).meetingId = generateRoomWithoutSeparator(jsonobj.roomNameDictionary)
                }
                if (!jsonobj.numbersEnabled) { return }
                this.numbers = jsonobj.numbers;
(this as any).inviteNumbersTextTemplate = jsonobj.inviteNumbersTextTemplate
                if (this.scheduleAutoCreateMeeting) {
                    ; (this as any).description?.clickAddMeeting(false, (this as any).location)
                    this.scheduleAutoCreateMeeting = false
                }
            })
            .catch((err) => {
                console.error('[event] number retrieve failed', err)
            })
    }

    /**
     * Inserts Jitsi button into the target container and wires initial handlers.
     */
    addJitsiButton() {
        const container = (this as any).buttonContainer
        if (!container) { return }
        const description = (this as any).description
        container.classList.add('button_container')
        const btnWrapper = createNodeFromHTML(
            '<div id="jitsi_button" class="goog-inline-block jfk-button jfk-button-action jfk-button-clear-outline">' +
            '  <a href="#" style="color: white"></a>' +
            '</div>'
        )
        container.appendChild(btnWrapper)
        description.update((this as any).location)
    }
}
