import { Description as BaseDescription } from "@calendar/description"
import { getKeyboardEvent, getNodeID } from "@calendar/dom"
import { EventContainer } from "@calendar/event"

export type MaybeTextArea = HTMLTextAreaElement & { noTextArea?: boolean };


export class Description extends BaseDescription {
    constructor(event: EventContainer) {
        super(event)
        let description = document.querySelector(getNodeID('descript textarea')) as MaybeTextArea | null
        const descriptionRow = document.querySelector(getNodeID('descript-row')) as HTMLElement | null
        if (!descriptionRow || descriptionRow.querySelectorAll('textarea').length === 0) {
            const divEl = document.querySelector('[id*="descript"] div > div > div') as HTMLElement | null
            if (divEl) {
                (divEl as unknown as MaybeTextArea).value = (divEl as HTMLElement).innerHTML;
                (divEl as unknown as MaybeTextArea).noTextArea = true
                description = divEl as unknown as MaybeTextArea
            }
        }
        (this as any).element = description as MaybeTextArea
    }
    get element(): MaybeTextArea { return (this as any).el as MaybeTextArea }
    set element(el: MaybeTextArea) { (this as any).el = el }
    get value(): string { return (this as any).el?.value }
    addDescriptionText(text: string) {
        const el = (this as any).el as MaybeTextArea
        if (el.noTextArea && typeof el.click === 'function') {
            el.click();
            (this as any).element = document.querySelector(getNodeID('descript textarea')) as MaybeTextArea
        }
        const target = (this as any).el as MaybeTextArea
        target.dispatchEvent(getKeyboardEvent('keydown'))
        if (target.value) { target.value = target.value + '\n' }
        target.value = (target.value || '') + text
        target.dispatchEvent(getKeyboardEvent('input'))
        target.dispatchEvent(getKeyboardEvent('keyup'))
        target.dispatchEvent(new Event('change', { bubbles: false, cancelable: true }))
    }
}