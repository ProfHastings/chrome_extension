function isVideoPlaying() {
   const video = document.querySelector('.html5-video-player video');
   console.log(video.readyState)
   console.log(video.paused)
   return video && video.readyState >= 3 && !video.paused;
 }
 
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'isVideoPlaying') {
     sendResponse({ playing: isVideoPlaying() });
   }
 })
