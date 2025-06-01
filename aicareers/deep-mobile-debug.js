// Deep debugging script for mobile navbar issue
console.log('🔍 Deep Mobile Debug Script Loaded');

// Wait for the page to load
function waitForNavigation() {
  const nav = document.querySelector('nav[aria-label="Main navigation"]');
  if (!nav) {
    console.log('⏳ Waiting for navigation to load...');
    setTimeout(waitForNavigation, 100);
    return;
  }
  
  console.log('✅ Navigation found:', nav);
  debugMobileNavigation();
}

function debugMobileNavigation() {
  // Find the X button
  const closeButtons = document.querySelectorAll('button');
  let xButton = null;
  
  closeButtons.forEach((btn, index) => {
    const hasX = btn.innerHTML.includes('×') || btn.innerHTML.includes('X') || 
                 btn.querySelector('svg') || btn.textContent.includes('Close');
    if (hasX) {
      console.log(`🎯 Found potential X button ${index}:`, btn);
      console.log('   - innerHTML:', btn.innerHTML);
      console.log('   - textContent:', btn.textContent);
      console.log('   - classes:', btn.className);
      
      // Check if this is the actual X button in the nav
      const nav = btn.closest('nav[aria-label="Main navigation"]');
      if (nav) {
        xButton = btn;
        console.log('✅ This is the X button in navigation!');
      }
    }
  });
  
  if (!xButton) {
    console.log('❌ No X button found in navigation');
    return;
  }
  
  // Check current event listeners
  console.log('🔍 Analyzing X button event listeners...');
  
  // Get all event listeners (if possible)
  const listeners = (typeof getEventListeners !== 'undefined') ? getEventListeners(xButton) : 'DevTools getEventListeners not available in this environment';
  console.log('   - Event listeners:', listeners);
  
  // Check React fiber properties
  const reactKeys = Object.keys(xButton).filter(key => key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternalFiber'));
  console.log('   - React keys:', reactKeys);
  
  // Monitor the navigation state
  const nav = document.querySelector('nav[aria-label="Main navigation"]');
  if (!nav) {
    console.log('❌ Navigation element not found in debugMobileNavigation');
    return;
  }
  
  console.log('🏗️ Current navigation state:');
  console.log('   - aria-expanded:', nav.getAttribute('aria-expanded'));
  
  // Use try-catch to prevent potential errors with getComputedStyle
  try {
    console.log('   - transform:', getComputedStyle(nav).transform);
    console.log('   - visibility:', getComputedStyle(nav).visibility);
    console.log('   - display:', getComputedStyle(nav).display);
  } catch (e) {
    console.log('   - Error getting computed style:', e.message);
  }
  
  // Hook into the X button click
  const originalClick = xButton.onclick;
  const originalAddEventListener = xButton.addEventListener;
  
  // Monitor direct onclick
  if (originalClick) {
    console.log('📝 Original onclick found:', originalClick.toString());
  }
  
  // Override addEventListener to monitor new listeners
  xButton.addEventListener = function(type, listener, options) {
    if (type === 'click') {
      console.log('🎭 New click listener added:', listener.toString());
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Add our own monitoring click listener
  xButton.addEventListener('click', function(e) {
    console.log('🖱️ X button clicked - our monitor detected it!');
    console.log('   - Event:', e);
    console.log('   - Target:', e.target);
    console.log('   - CurrentTarget:', e.currentTarget);
    
    // Check navigation state before and after
    setTimeout(() => {
      const navAfter = document.querySelector('nav[aria-label="Main navigation"]');
      console.log('📊 Navigation state after click:');
      if (navAfter) {
        try {
          console.log('   - transform:', getComputedStyle(navAfter).transform);
          console.log('   - aria-expanded:', navAfter.getAttribute('aria-expanded'));
        } catch (e) {
          console.log('   - Error getting computed style after click:', e.message);
        }
      } else {
        console.log('   - Navigation element not found after click');
      }
    }, 100);
  }, true); // Use capture phase
  
  // Monitor for React state changes
  let previousTransform = 'none';
  try {
    if (nav) {
      previousTransform = getComputedStyle(nav).transform;
    }
  } catch (e) {
    console.log('Error getting initial transform:', e.message);
  }
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        if (nav && nav.parentNode) {
          try {
            const currentTransform = getComputedStyle(nav).transform;
            if (currentTransform !== previousTransform) {
              console.log('🔄 Navigation transform changed:');
              console.log('   - From:', previousTransform);
              console.log('   - To:', currentTransform);
              previousTransform = currentTransform;
            }
          } catch (e) {
            console.log('Error monitoring transform changes:', e.message);
          }
        }
      }
    });
  });
  
  observer.observe(nav, { 
    attributes: true, 
    attributeFilter: ['style', 'aria-expanded', 'class'],
    subtree: true 
  });
  
  console.log('🚀 Mobile navigation debugging setup complete!');
  console.log('🎯 Try clicking the X button now...');
}

// Start debugging when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForNavigation);
} else {
  waitForNavigation();
}
