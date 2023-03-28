function displayTimeSpent() {
  chrome.storage.local.get('timeSpentOnYouTube', (data) => {
    const parsedValue = parseFloat(data.timeSpentOnYouTube);
    const timeSpent = parsedValue || 0;

    const days = Math.floor(timeSpent / 86400);
    const hours = Math.floor((timeSpent % 86400) / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);
    const seconds = Math.floor(timeSpent % 60);

    document.getElementById('timeSpent').textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  });
}

// Update the time display when the popup is opened and every second
displayTimeSpent();
setInterval(displayTimeSpent, 3000);