export function getNodeID(name: string): string {
    return '#' + getNodePrefix() + '\\.' + name
}

export function getNodePrefix(): string {
    const labelNode = document.querySelector("[id*='location-label']") as HTMLElement | null
    if (labelNode && labelNode.id) {
        return labelNode.id.split('.')[0]
    }

    return ''
}

type LegacyKeyboardEvent = KeyboardEvent & {
    initKeyboardEvent?: (...args: unknown[]) => void;
    initKeyEvent?: (...args: unknown[]) => void;
};

export function getKeyboardEvent(event: string): KeyboardEvent {
    const KeyboardEventCtor: any = (globalThis as any).KeyboardEvent
    let created: KeyboardEvent | null = null
    if (typeof KeyboardEventCtor === 'function') {
        try {
            created = new KeyboardEventCtor(event, { bubbles: true, cancelable: true }) as KeyboardEvent
        } catch {
            created = null // fallback to legacy API below
        }
        if (created) { return created }
    }
    const keyboardEvent = document.createEvent('KeyboardEvent') as LegacyKeyboardEvent
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (typeof keyboardEvent.initKeyboardEvent !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        (keyboardEvent.initKeyboardEvent as unknown as ((
            type: string,
            canBubble: boolean,
            cancelable: boolean,
            view: Window,
            ctrlKey: boolean,
            altKey: boolean,
            shiftKey: boolean,
            metaKey: boolean,
            keyCode: number,
            charCode: number
        ) => void))(event, true, true, (document.defaultView as any), false, false, false, false, 32, 0)
    } else if (typeof keyboardEvent.initKeyEvent !== 'undefined') {

        (keyboardEvent.initKeyEvent as unknown as ((
            type: string,
            canBubble: boolean,
            cancelable: boolean,
            view: Window,
            ctrlKey: boolean,
            altKey: boolean,
            shiftKey: boolean,
            metaKey: boolean,
            keyCode: number,
            charCode: number
        ) => void))(event, true, true, (document.defaultView as any), false, false, false, false, 32, 0)
    }

    return keyboardEvent as KeyboardEvent
}

export function findGetParameter(parameterName: string): string | null {
    const params = new URLSearchParams(window.location.search)
    const val = params.get(parameterName)

    return val ? decodeURIComponent(val) : null
}
