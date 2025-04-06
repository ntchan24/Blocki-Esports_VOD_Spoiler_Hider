// Initialize state
let hideComments = false;
let hideSeekbar = false;

// Load saved states
chrome.storage.sync.get(['hideComments', 'hideSeekbar'], function(result) {
  hideComments = result.hideComments || false;
  hideSeekbar = result.hideSeekbar || false;
  
  // Apply saved states
  toggleComments(hideComments);
  toggleSeekbar(hideSeekbar);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleComments') {
    toggleComments(request.hide);
  } else if (request.action === 'toggleSeekbar') {
    toggleSeekbar(request.hide);
  }
});

// Toggle comments visibility
function toggleComments(hide) {
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    if (hide) {
      document.body.classList.add('yt-hide-comments');
    } else {
      document.body.classList.remove('yt-hide-comments');
    }
  }
}

// Toggle seekbar visibility
function toggleSeekbar(hide) {
  // YouTube's video player controls
  const playerControls = document.querySelector('.ytp-chrome-bottom');
  if (playerControls) {
    if (hide) {
      document.body.classList.add('yt-hide-seekbar');
    } else {
      document.body.classList.remove('yt-hide-seekbar');
    }
  }
}

// Re-apply settings when YouTube's content changes (SPA navigation)
const observer = new MutationObserver(function() {
  if (hideComments) {
    toggleComments(true);
  }
  if (hideSeekbar) {
    toggleSeekbar(true);
  }
});

// Start observing when page is fully loaded
window.addEventListener('load', function() {
  observer.observe(document.body, { childList: true, subtree: true });
});