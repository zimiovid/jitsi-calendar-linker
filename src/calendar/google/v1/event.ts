import { getNodeID, getNodePrefix } from "@calendar/dom"
import { insertAfter,isVisible } from "@calendar/domUtils"
import { EventContainer } from "@calendar/event"

import { Description } from "./description"
import { GLocation } from "./location"

/**
 * Google Calendar classic UI event container implementation
 */
export class Event extends EventContainer {
    /**
     * @param eventEditPage Root element of edit page table
     */
    constructor(eventEditPage: HTMLElement) {
        super();
        (this as any).container = eventEditPage
    }
    /** Runs periodic UI update and injects button if needed */
    update() {
        const tbl = document.querySelector('table.ep-dp-dt')
        if (tbl && isVisible(tbl)) {
            this.updateMeetingId()
            if (!this.isButtonPresent()) { this.addJitsiButton() }
        }
    }
    /** Lazily resolves location adapter for classic UI */
    get location() {
        if (!(this as any).locationInstance) { (this as any).locationInstance = new GLocation() }

        return (this as any).locationInstance
    }
    /** Creates row after rtc-row and returns target TD as button container */
    get buttonContainer() {
        const neighbor = document.querySelector(getNodeID('rtc-row')) as any
        if (!neighbor) { return null }
        const newRowID = getNodePrefix() + '.' + 'jitsi-rtc-row'
        const newRow = document.createElement('tr');
        (newRow as any).id = newRowID;
        (newRow as any).innerHTML = '<th class="ep-dp-dt-th"></th><td class="ep-dp-dt-td"></td>'
        insertAfter(newRow, neighbor)

        return (newRow as any).querySelector('td')
    }
    /** Lazily resolves description adapter for classic UI */
    get description() {
        if (!(this as any).descriptionInstance) { (this as any).descriptionInstance = new Description(this) }

        return (this as any).descriptionInstance
    }
}