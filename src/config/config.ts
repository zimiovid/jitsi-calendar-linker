export type UserConfig = {
    domain: string;
    numbersEnabled: boolean;
    numbersUrl: string | false;
    mapperUrl: string | false;
    generateDigitsName: boolean;
};

export const DEFAULT_CONFIG: UserConfig = {
    domain: 'meet.jit.si',
    numbersEnabled: false,
    numbersUrl: false,
    mapperUrl: false,
    generateDigitsName: true
}

type ConfigCallback = (_cfg: UserConfig) => void;

export function getConfig(callback: ConfigCallback) {
    try {
        chrome.storage.sync.get(DEFAULT_CONFIG, (res) => {
            const config: UserConfig = {
                domain: res.domain ?? DEFAULT_CONFIG.domain,
                numbersEnabled: res.numbersEnabled ?? DEFAULT_CONFIG.numbersEnabled,
                numbersUrl: res.numbersUrl ?? DEFAULT_CONFIG.numbersUrl,
                mapperUrl: res.mapperUrl ?? DEFAULT_CONFIG.mapperUrl,
                generateDigitsName: res.generateDigitsName ?? DEFAULT_CONFIG.generateDigitsName
            }
            callback(config)
        })
    } catch {
        callback(DEFAULT_CONFIG)
    }
}

export function saveConfig(cfg: UserConfig, callback?: () => void) {
    try {
        chrome.storage.sync.set({
            domain: cfg.domain,
            numbersEnabled: cfg.numbersEnabled,
            numbersUrl: cfg.numbersUrl,
            mapperUrl: cfg.mapperUrl,
            generateDigitsName: cfg.generateDigitsName
        }, () => callback && callback())
    } catch {
        if (callback) { callback() }
    }
}


