console.log("Background service worker has loaded via Manifest V3.");

const PROTECTION_ENABLED_KEY = 'protectionEnabled';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({[PROTECTION_ENABLED_KEY]: true});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const {type} = request;

    switch (type) {
        case'getProtectionEnabled': {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], (data) => {
                const res = {data};
                sendResponse(res);
            });
            return true;
        }
        case 'setProtectionEnabled': {
            try {
                const data = {[PROTECTION_ENABLED_KEY]: request.data[PROTECTION_ENABLED_KEY]};
                chrome.storage.local.set(data)
                sendResponse(data)
            } catch (e) {
                console.error(e);
            }
            return true;
        }
        case 'getCss': {
            const getCssRules = () => {
                const exampleRule = ['* { background-color: pink }'];

                /* emulate async call to server */
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(exampleRule);
                    }, 1000);
                });
            };

            getCssRules().then((rules) => {
                sendResponse(rules);
            });
            return true;
        }
        default:
            return;
    }
});
