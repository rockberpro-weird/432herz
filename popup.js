const $ = (id) => document.getElementById(id);
let onYouTube = false;

/** Says what is actually in effect, and blocks the buttons where they'd be a no-op */
function render() {
    const all = $('allTabs').checked;
    const mode = $('herz432').classList.contains('pressed') ? '432Hz'
        : $('herz440').classList.contains('pressed') ? '440Hz'
        : null;
    const blocked = !onYouTube && !all;

    $('herz432').disabled = blocked;
    $('herz440').disabled = blocked;
    $('status').textContent = blocked
        ? 'Open a YouTube tab to apply'
        : `${mode ?? 'Not set'} · ${all ? 'all YouTube tabs' : 'this tab'}`;
}

function setPressed(id) {
    $('herz432').classList.toggle('pressed', id === 'herz432');
    $('herz440').classList.toggle('pressed', id === 'herz440');
    render();
}

async function apply(id, file, tab) {
    const is432 = id === 'herz432';

    if ($('allTabs').checked) {
        // Apply to all YouTube tabs
        const youtubeTabs = await chrome.tabs.query({ url: "*://*.youtube.com/*" });
        for (const ytTab of youtubeTabs) {
            chrome.scripting.executeScript({ target: { tabId: ytTab.id }, files: [file] });
        }
        chrome.storage.local.set({ 'herz432_global': is432, 'herz440_global': !is432 });
    } else if (tab?.id) {
        // Apply only to the current tab
        chrome.scripting.executeScript({ target: { tabId: tab.id }, files: [file] });
        chrome.storage.local.set({ [`herz432_${tab.id}`]: is432, [`herz440_${tab.id}`]: !is432 });
    }

    setPressed(id);
}

document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    onYouTube = /^https:\/\/(www|music)\.youtube\.com\//.test(tab?.url || "");

    chrome.storage.local.get(['herz_all_tabs', `herz432_${tab?.id}`, `herz440_${tab?.id}`, 'herz432_global', 'herz440_global'], (result) => {
        $('allTabs').checked = result.herz_all_tabs === true;
        // global settings when "all tabs" is on, otherwise this tab's own
        const scope = result.herz_all_tabs ? 'global' : tab?.id;

        if (result[`herz432_${scope}`]) setPressed('herz432');
        else if (result[`herz440_${scope}`]) setPressed('herz440');
        else render();
    });

    $('allTabs').addEventListener('change', function () {
        const allTabsEnabled = this.checked;
        chrome.storage.local.set({ 'herz_all_tabs': allTabsEnabled }, () => {
            // If "All tabs" is activated, copy current tab settings to global settings
            if (allTabsEnabled && tab?.id) {
                chrome.storage.local.get([`herz432_${tab.id}`, `herz440_${tab.id}`], (result) => {
                    chrome.storage.local.set({
                        'herz432_global': result[`herz432_${tab.id}`] || false,
                        'herz440_global': result[`herz440_${tab.id}`] || false
                    });
                });
            }
        });
        render();
    });

    $('herz432').addEventListener('click', () => apply('herz432', '432hz.js', tab));
    $('herz440').addEventListener('click', () => apply('herz440', '440hz.js', tab));
});
