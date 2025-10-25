import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_CONFIG, getConfig, saveConfig, UserConfig } from '../config'

describe('config storage', () => {
    it('getConfig falls back to defaults on exception', () => {
        ; (globalThis as any).chrome = { storage: { sync: { get: () => { throw new Error('x') } } } }
        let got: UserConfig | null = null
        getConfig(c => { got = c })
        expect(got).toEqual(DEFAULT_CONFIG)
    })

    it('getConfig returns values from chrome.storage.sync', () => {
        ; (globalThis as any).chrome = {
            storage: { sync: { get: (defaults: any, cb: any) => cb({ domain: 'd', numbersEnabled: true, numbersUrl: 'u', mapperUrl: 'm', generateDigitsName: false }) } }
        }
        let got: UserConfig | null = null
        getConfig(c => { got = c })
        expect(got).toEqual({ domain: 'd', numbersEnabled: true, numbersUrl: 'u', mapperUrl: 'm', generateDigitsName: false })
    })

    it('saveConfig writes to chrome.storage and invokes callback', () => {
        const set = vi.fn((_v: any, cb: any) => cb());
(globalThis as any).chrome = { storage: { sync: { set } } }
        const cfg: UserConfig = { domain: 'd', numbersEnabled: true, numbersUrl: 'u', mapperUrl: 'm', generateDigitsName: false }
        const cb = vi.fn()
        saveConfig(cfg, cb)
        expect(set).toHaveBeenCalled()
        expect(cb).toHaveBeenCalled()
    })
})


