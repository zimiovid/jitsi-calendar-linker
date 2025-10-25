export function isVisible(el: Element | null): boolean {
    if (!el) {return false}
    const anyEl = el as any
    if (anyEl.nodeType !== 1) {return false}

    const style = window.getComputedStyle(el)
    if (!style) {return false}
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {return false}

    const rects = anyEl.getClientRects ? anyEl.getClientRects() : []
    const noSize = (anyEl.offsetWidth + anyEl.offsetHeight) === 0

    return !(noSize && (!rects || rects.length === 0))
}

export function createNodeFromHTML(html: string): HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()

    return template.content.firstChild as HTMLElement
}

export function insertAfter(newNode: Node, referenceNode: Node): void {
    if (!referenceNode || !referenceNode.parentNode) { return }
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}


