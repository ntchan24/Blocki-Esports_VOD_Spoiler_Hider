document.addEventListener('DOMContentLoaded', function() {
  // Get toggle elements
  const commentsToggle = document.getElementById('comments-toggle');
  const seekbarToggle = document.getElementById('seekbar-toggle');

  // Load saved states
  chrome.storage.sync.get(['hideComments', 'hideSeekbar'], function(result) {
    commentsToggle.checked = result.hideComments || false;
    seekbarToggle.checked = result.hideSeekbar || false;
  });

  // Add toggle event listeners
  commentsToggle.addEventListener('change', function() {
    const hideComments = commentsToggle.checked;
    
    // Save state
    chrome.storage.sync.set({ hideComments: hideComments });
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleComments', 
          hide: hideComments 
        });
      }
    });
  });

  seekbarToggle.addEventListener('change', function() {
    const hideSeekbar = seekbarToggle.checked;
    
    // Save state
    chrome.storage.sync.set({ hideSeekbar: hideSeekbar });
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleSeekbar', 
          hide: hideSeekbar 
        });
      }
    });
  });
});