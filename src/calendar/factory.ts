import { EventContainer } from './event'
import { Event as GEvent } from './google/v1'
import { Event as G2Event } from './google/v2'

export function getEventContainerInstance(): EventContainer | undefined {
    try {
        const eventEditPage = document.querySelector('#maincell #coverinner')
        if (eventEditPage) { return new GEvent(eventEditPage as HTMLElement) }
        const body = document.querySelector('body') as HTMLElement | null
        if (body && (body as any).dataset?.viewfamily) { return new G2Event(body) }

        return undefined
    } catch (err) {
        console.error('[factory] getEventContainerInstance error', err)

        return undefined
    }
}


