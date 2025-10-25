import { getKeyboardEvent } from "@calendar/dom"
import { Location as BaseLocation } from "@calendar/location"

export class GLocation extends BaseLocation {
    inputEl: HTMLInputElement | null
    displayEl: HTMLElement | null = null
    constructor() {
        super()
        this.inputEl = document.querySelector('[id*=location].ep-dp-input input') as HTMLInputElement | null
        if (!this.inputEl) {
            this.displayEl = document.querySelector('[id*=location].ep-dp-input div > div') as HTMLElement | null
        }
    }
    get text() {
        if (this.inputEl) { return this.inputEl.value }
        if (this.displayEl) { return this.displayEl.innerHTML }

        return undefined
    }
    addLocationText(text: string) {
        let locationNode: HTMLInputElement | null = this.inputEl
        if (!locationNode) {
            if (this.displayEl && typeof this.displayEl.click === 'function') { this.displayEl.click() }
            this.inputEl = document.querySelector('[id*=location].ep-dp-input input') as HTMLInputElement | null
            locationNode = this.inputEl
        }
        if (locationNode) {
            locationNode.dispatchEvent(getKeyboardEvent('keydown'))
            locationNode.value = locationNode.value === '' ? text : locationNode.value + ', ' + text
            locationNode.dispatchEvent(getKeyboardEvent('input'))
            locationNode.dispatchEvent(getKeyboardEvent('keyup'))
            locationNode.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }))
        }
    }
}