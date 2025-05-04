// Initialize state
let hideComments = false;
let hideSeekbar = false;

// Load saved states
chrome.storage.sync.get(['hideComments', 'hideSeekbar'], function(result) {
  hideComments = result.hideComments || false;
  hideSeekbar = result.hideSeekbar || false;
  
  // Apply saved states immediately
  applySettings();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleComments') {
    hideComments = request.hide;
    applySettings();
    sendResponse({success: true});
  } else if (request.action === 'toggleSeekbar') {
    hideSeekbar = request.hide;
    applySettings();
    sendResponse({success: true});
  }
  return true; // Required for async sendResponse
});

// Apply all current settings at once
function applySettings() {
  toggleComments(hideComments);
  toggleSeekbar(hideSeekbar);
}

// Toggle comments visibility with retry mechanism
function toggleComments(hide) {
  document.body.classList.toggle('yt-hide-comments', hide);
  
  // Force immediate hide/show by directly manipulating any comments that exist
  const commentsSection = document.getElementById('comments');
  if (commentsSection) {
    commentsSection.style.display = hide ? 'none' : '';
  }
  
  // Try to find comments by other selectors YouTube might use
  const alternativeComments = document.querySelectorAll('#comments, ytd-comments, tp-yt-paper-listbox#sections');
  alternativeComments.forEach(element => {
    if (element) {
      element.style.display = hide ? 'none' : '';
    }
  });
}

// Toggle seekbar visibility with retry mechanism
function toggleSeekbar(hide) {
  document.body.classList.toggle('yt-hide-seekbar', hide);
  
  // Force immediate hide/show by directly manipulating elements
  const playerControls = document.querySelectorAll('.ytp-chrome-bottom');
  playerControls.forEach(control => {
    if (control) {
      control.style.display = hide ? 'none' : '';
    }
  });
}

// Function to apply settings whenever YouTube content loads or changes
function setupObservers() {
  // Observer for the entire document to catch major DOM changes
  const bodyObserver = new MutationObserver(function(mutations) {
    applySettings();
  });
  
  // Start observing document body for child changes
  bodyObserver.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: false,
    characterData: false
  });
  
  // Specific observer for the video player area
  const videoObserver = new MutationObserver(function(mutations) {
    applySettings();
  });
  
  // Try to observe the video player area
  const videoContainer = document.querySelector('#movie_player') || document.querySelector('ytd-player');
  if (videoContainer) {
    videoObserver.observe(videoContainer, { 
      childList: true,
      subtree: true,
      attributes: true
    });
  }
}

// Apply settings immediately when script loads
applySettings();

// Watch for YouTube SPA navigation events
window.addEventListener('yt-navigate-finish', function() {
  setTimeout(applySettings, 100); // Short delay after navigation completes
});

// Regular interval to ensure settings are applied (YouTube can be tricky with its DOM)
const applyInterval = setInterval(applySettings, 1000);

// Set up observers when page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupObservers);
} else {
  setupObservers();
}