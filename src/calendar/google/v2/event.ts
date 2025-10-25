// @ts-ignore
import { createNodeFromHTML } from "@calendar/domUtils"
import { EventContainer } from "@calendar/event"

// @ts-ignore
import buttonContainerHtml from '../../../templates/_buttonContainer.html'
import { Description } from './description'
import { Location } from './location'

export class Event extends EventContainer {
    constructor(eventEditPage: HTMLElement) {
        super();
        (this as any).container = eventEditPage
    }
    update() {
        if (document.querySelector('#xNtList')
            && (document.querySelector('#xLocIn') || document.querySelector('#xOnCal') || document.querySelector('#xDescIn') || document.querySelector('#xDesc'))
            && !this.isButtonPresent()) {
            this.updateMeetingId()
            this.addJitsiButton()
        }
    }
    get location() {
        if (!(this as any).locationInstance) { (this as any).locationInstance = new Location() }

        return (this as any).locationInstance
    }
    get buttonContainer() {
        let neighbor: any = document.querySelector('#xNtList')
        if (!neighbor || !neighbor.parentElement) { return null }
        neighbor = neighbor.parentElement
        const buttonContainer = document.querySelector('#jitsi_button_container')
        if (buttonContainer) { return (buttonContainer as any).querySelector('content') }
        const newRow = createNodeFromHTML(buttonContainerHtml as any);
        (neighbor as any).parentNode.insertBefore(newRow, neighbor)

        return (newRow as any).querySelector('content')
    }
    addJitsiButton() {
        const container = (this as any).buttonContainer
        if (!container) { return false }
        (this as any).description.update((this as any).location)
    }
    get description() {
        if (!(this as any).descriptionInstance) { (this as any).descriptionInstance = new Description(this) }

        return (this as any).descriptionInstance
    }
}