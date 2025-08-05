// extension/background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.title){
        const payload = {
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
        };
    }

    fetch('http://localhost:3000/api/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(err => {console.error('Error logging tab activity:', err)});
});