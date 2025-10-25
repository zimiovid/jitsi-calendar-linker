function onAnchorClick(e: Event) {
    const target = e.target as HTMLAnchorElement
    if (!target || !target.href) { return }
    chrome.tabs.create({ url: target.href + '&extid=' + chrome.runtime.id })
    window.close()
}

document.addEventListener('DOMContentLoaded', function () {
    const anchors = document.querySelectorAll('a')
    for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', onAnchorClick)
    }
})


