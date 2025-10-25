export let BASE_DOMAIN = 'meet.jit.si'
export let BASE_URL = 'https://' + BASE_DOMAIN + '/'
export const APP_NAME = 'Jitsi'
export const LOCATION_TEXT = APP_NAME + ' Meeting'
export let NUMBER_RETRIEVE_SCRIPT: string | false = false
export let CONFERENCE_MAPPER_SCRIPT: string | false = false
export let generateRoomNameAsDigits = true

export function setDomain(domain: string): void {
    if (domain && typeof domain === 'string') {
        BASE_DOMAIN = domain
        BASE_URL = 'https://' + BASE_DOMAIN + '/'
    }
}

/**
 * Applies extended runtime configuration.
 * @param cfg - Partial configuration with optional fields.
 */
export function setConfig(cfg: {
    domain?: string;
    numbersEnabled?: boolean;
    numbersUrl?: string | false;
    mapperUrl?: string | false;
    generateDigitsName?: boolean;
}): void {
    if (cfg.domain) { setDomain(cfg.domain) }
    if (typeof cfg.generateDigitsName === 'boolean') { generateRoomNameAsDigits = cfg.generateDigitsName }
    if (cfg.numbersEnabled === false) {
        NUMBER_RETRIEVE_SCRIPT = false
    } else if (typeof cfg.numbersUrl === 'string' && cfg.numbersUrl.length > 0) {
        NUMBER_RETRIEVE_SCRIPT = cfg.numbersUrl
    }
    if (typeof cfg.mapperUrl === 'string' && cfg.mapperUrl.length > 0) {
        CONFERENCE_MAPPER_SCRIPT = cfg.mapperUrl
    } else if (cfg.mapperUrl === false) {
        CONFERENCE_MAPPER_SCRIPT = false
    }
}


