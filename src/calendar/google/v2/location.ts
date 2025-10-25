import { getKeyboardEvent } from "@calendar/dom"
import { Location as BaseLocation } from "@calendar/location"

export class Location extends BaseLocation {
    _getSelector() {
        return document.querySelector('#xLocIn input[jsname="YPqjbf"][role="combobox"]')
    }
    _getLocationElement() {
        let elem: any = (this as any)._getSelector()
        if (!elem) {
            const element = document.querySelector('#xOnCal') as any
            if (!element) { return undefined }
            elem = element;
            (elem as any).val = function () { return element.innerHTML }
        }

        return elem
    }
    get text() {
        const e: any = (this as any)._getLocationElement()
        if (e) {
            if (e.getAttribute && (e.getAttribute('role') === 'combobox' || e.tagName === 'INPUT')) { return e.value }
            if (typeof e.val === 'function') { return e.val() }

            return e.textContent
        }

  return undefined 
    }
    addLocationText(text: string) {
        const elem: any = (this as any)._getSelector()
        if (!elem) { return }
        const locationNode = elem
        if (locationNode) {
            locationNode.focus()
            locationNode.value = locationNode.value === '' ? text : locationNode.value + ', ' + text
            locationNode.dispatchEvent(getKeyboardEvent('input'))
            window.setTimeout(function () {
                locationNode.focus()
                locationNode.value = locationNode.value + " "
                locationNode.dispatchEvent(getKeyboardEvent('input'))
            }, 1000)
        }
    }
}