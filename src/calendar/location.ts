/**
 * Abstraction over event location field used across Calendar UIs.
 */
export class Location {
    el: HTMLElement | null = null
    get text(): string | undefined { return this.el ? this.el.textContent || undefined : undefined }
    addLocationText(text: string): void { if (this.el) { this.el.textContent = text } }
}


