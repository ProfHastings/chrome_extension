function displayTimeSpent() {
  chrome.storage.local.get('timeSpentOnYouTube', (data) => {
    console.log('Raw data:', data.timeSpentOnYouTube); // Check the raw value from storage
    const parsedValue = parseFloat(data.timeSpentOnYouTube);
    console.log('Parsed value:', parsedValue); // Check the parsed value
    const timeSpent = parsedValue || 0;
      document.getElementById('timeSpent').textContent = timeSpent.toFixed(2);
    });
  }
  // Update the time display when the popup is opened and every second
  displayTimeSpent();
  setInterval(displayTimeSpent, 1000);