let startTimes = {};
let timeoutIds = {};

function trackYouTubeTime(tabId) {
  chrome.tabs.sendMessage(tabId, { action: 'isVideoPlaying' }, (response) => {
    if (chrome.runtime.lastError) {
      // Handle errors, such as the tab being closed
      return;
    }

    if (response && response.playing) {
      if (!startTimes[tabId]) {
        startTimes[tabId] = new Date();
      }
      const currentTime = new Date();
      const timeSpent = (currentTime - startTimes[tabId]) / 1000;
      saveTimeSpent(timeSpent);
      startTimes[tabId] = currentTime;
      console.log('Video is playing');

      // Set a new timeout only if the video is playing
      timeoutIds[tabId] = setTimeout(() => trackYouTubeTime(tabId), 3000);
    } else {
      if (startTimes[tabId]) {
        const timeSpent = (new Date() - startTimes[tabId]) / 1000;
        startTimes[tabId] = null;

        // Save timeSpent to storage
        saveTimeSpent(timeSpent);
      }
      console.log('Video is not playing');
    }
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
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/;

  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com')) {
    console.log('Tab updated with YouTube URL');
    // Check if the video is playing before tracking time
    chrome.tabs.sendMessage(tabId, { action: 'isVideoPlaying' }, (response) => {
      if (response && response.playing) {
        console.log('Video is playing in the updated tab');
        trackYouTubeTime(tabId);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'videoStateChanged') {
    const tabId = sender.tab.id;
    if (message.playing) {
      console.log('Video is playing in tab', tabId);
      trackYouTubeTime(tabId);
    } else {
      console.log('Video is paused in tab', tabId);
      // Video tracking stopped in trackYouTubeTime function
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
  if (startTimes[tabId]) {
    const timeSpent = (new Date() - startTimes[tabId]) / 1000;
    startTimes[tabId] = null;
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