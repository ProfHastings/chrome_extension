let startTime = null;

function trackYouTubeTime(tabId) {
  console.log('test');
  chrome.tabs.sendMessage(tabId, { action: 'isVideoPlaying' }, (response) => {
    if (chrome.runtime.lastError) {
      // Handle errors, such as the tab being closed
      return;
    }

    if (response && response.playing) {
      if (!startTime) {
        startTime = new Date();
      }
      console.log('Video is playing');
    } else {
      if (startTime) {
        const timeSpent = (new Date() - startTime) / 1000;
        startTime = null;

        // Save timeSpent to storage
        saveTimeSpent(timeSpent);
      }
      console.log('Video is not playing');

    }

    // Continue monitoring the tab every few seconds (e.g., 1 second)
    setTimeout(() => trackYouTubeTime(tabId), 1000);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('Tab updated:', tabId, changeInfo, tab); // Log tab update details

  if (changeInfo.status === 'complete') {
    console.log('Tab status is complete:', tab.url); // Log when a tab has completed loading
  }

  if (tab.url.includes('youtube.com')) {
    console.log('Tab URL includes youtube.com:', tab.url); // Log when a tab URL contains youtube.com
  }

  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com')) {
    trackYouTubeTime(tabId);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('Tab updated:', tabId, changeInfo, tab); // Add this line
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/;

  if (changeInfo.status === 'complete' && youtubeRegex.test(tab.url)) {
    console.log('test');
    trackYouTubeTime(tabId);
}
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId); // Add this line
  if (startTime) {
    const timeSpent = (new Date() - startTime) / 1000;
    startTime = null;
    saveTimeSpent(timeSpent);
  }
});

function saveTimeSpent(timeSpent) {
    chrome.storage.local.get('timeSpentOnYouTube', (data) => {
      const totalTimeSpent = (parseFloat(data.timeSpentOnYouTube) || 0) + timeSpent;
      console.log('Saving time spent:', totalTimeSpent);
      chrome.storage.local.set({ timeSpentOnYouTube: totalTimeSpent.toString() });
    });
  }