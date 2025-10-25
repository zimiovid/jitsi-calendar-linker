import { getConfig, saveConfig } from './config/config'

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('domain') as HTMLInputElement
    const numbersEnabledEl = document.getElementById('numbersEnabled') as HTMLInputElement
    const numbersUrlEl = document.getElementById('numbersUrl') as HTMLInputElement
    const mapperUrlEl = document.getElementById('mapperUrl') as HTMLInputElement
    const generateDigitsEl = document.getElementById('generateDigitsName') as HTMLInputElement
    const btn = document.getElementById('save') as HTMLButtonElement

    getConfig(cfg => {
        input.value = cfg.domain
        numbersEnabledEl.checked = cfg.numbersEnabled
        numbersUrlEl.value = typeof cfg.numbersUrl === 'string' ? cfg.numbersUrl : ''
        mapperUrlEl.value = typeof cfg.mapperUrl === 'string' ? cfg.mapperUrl : ''
        generateDigitsEl.checked = cfg.generateDigitsName
    })

    btn.addEventListener('click', () => {
        const domain = (input.value || '').trim()
        if (!domain) { return }
        const cfg = {
            domain,
            numbersEnabled: !!numbersEnabledEl.checked,
            numbersUrl: (numbersUrlEl.value || '').trim() || false,
            mapperUrl: (mapperUrlEl.value || '').trim() || false,
            generateDigitsName: !!generateDigitsEl.checked
        }
        saveConfig(cfg as any, () => { window.close() })
    })
})


