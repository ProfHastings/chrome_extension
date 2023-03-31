let video;

function getVideo() {
  video = document.querySelector('.html5-video-player video');
  if (video) {
    video.addEventListener('play', () => {
      chrome.runtime.sendMessage({ action: 'videoStateChanged', playing: true });
    });

    video.addEventListener('pause', () => {
      chrome.runtime.sendMessage({ action: 'videoStateChanged', playing: false });
    });

    video.addEventListener('ended', () => {
      chrome.runtime.sendMessage({ action: 'videoStateChanged', playing: false });
    });

    video.addEventListener('loadeddata', () => {
      if (!video.paused) {
        chrome.runtime.sendMessage({ action: 'videoStateChanged', playing: true });
      }
    });
  } else {
    setTimeout(getVideo, 1000);
  }
}

getVideo();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'isVideoPlaying') {
    const isPlaying = video && video.readyState >= 3 && !video.paused;
    sendResponse({ playing: isPlaying });
  }
});