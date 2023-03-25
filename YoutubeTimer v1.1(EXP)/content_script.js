function isVideoPlaying() {
   const video = document.querySelector('video');
   return video && !video.paused;
 }
 
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'isVideoPlaying') {
     sendResponse({ playing: isVideoPlaying() });
   }
 })
