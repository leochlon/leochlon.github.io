// FINAL MOBILE NAVIGATION FIX
// This is the definitive solution for the mobile nav close button issue

(function() {
  'use strict';

  let isFixed = false;
  const DEBUG = true;

  function log(message, ...args) {
    if (DEBUG) {
      console.log(`🔧 FINAL NAV FIX: ${message}`, ...args);
    }
  }

  // Single comprehensive fix function
  function applyFinalFix() {
    if (isFixed) return;
    
    log('Applying final mobile navigation fix...');

    // 1. Find the X button using multiple strategies
    const findXButton = () => {
      // Strategy 1: Find by class
      let xButton = document.querySelector('.mobile-nav-x-btn, #mobile-nav-close-button');
      
      // Strategy 2: Find by aria-label
      if (!xButton) {
        xButton = document.querySelector('button[aria-label="Close navigation menu"]');
      }
      
      // Strategy 3: Find by SVG content
      if (!xButton) {
        const buttons = document.querySelectorAll('nav button');
        for (const button of buttons) {
          const svg = button.querySelector('svg');
          if (svg) {
            const path = svg.querySelector('path');
            if (path && path.getAttribute('d')) {
              const d = path.getAttribute('d');
              if (d.includes('M6 18L18 6') || d.includes('M6 6l12 12')) {
                xButton = button;
                break;
              }
            }
          }
        }
      }
      
      return xButton;
    };

    const xButton = findXButton();
    if (!xButton) {
      log('X button not found, will retry...');
      return false;
    }

    log('Found X button:', xButton);

    // 2. Clear ALL existing event listeners on the button
    const newButton = xButton.cloneNode(true);
    xButton.parentNode.replaceChild(newButton, xButton);
    
    // 3. Add our single, direct close handler
    newButton.addEventListener('click', function(event) {
      log('X button clicked - forcing close');
      
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Force close the menu immediately
      forceCloseMenu();
      
      return false;
    }, { capture: true, once: false });

    // 4. Also handle touch events for mobile
    newButton.addEventListener('touchstart', function(event) {
      log('X button touched - forcing close');
      
      event.preventDefault();
      event.stopPropagation();
      
      // Small delay to handle touch properly
      setTimeout(() => forceCloseMenu(), 50);
      
      return false;
    }, { capture: true, once: false });

    // Mark as fixed
    newButton.setAttribute('data-final-fixed', 'true');
    isFixed = true;
    
    log('X button successfully fixed');
    return true;
  }

  // Force close function
  function forceCloseMenu() {
    log('Force closing mobile menu...');

    // Method 1: Click the overlay
    const overlay = document.querySelector('#mobile-nav-overlay, .mobile-overlay, [role="dialog"]');
    if (overlay) {
      log('Clicking overlay to close');
      overlay.click();
    }

    // Method 2: Set React state via global flag
    window.__FORCE_CLOSE_MOBILE_NAV__ = true;

    // Method 3: Dispatch custom events
    const events = ['forceCloseMobileNav', 'closeNavigation', 'menuClose'];
    events.forEach(eventName => {
      document.dispatchEvent(new CustomEvent(eventName, { 
        bubbles: true,
        detail: { source: 'final-fix' }
      }));
    });

    // Method 4: Direct React component call if available
    if (window.__navigationComponent && window.__navigationComponent.forceClose) {
      log('Calling React component forceClose');
      window.__navigationComponent.forceClose();
    }

    // Method 5: Click outside to trigger close
    setTimeout(() => {
      const mainContent = document.querySelector('main, #main-content, .app-container');
      if (mainContent) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        mainContent.dispatchEvent(clickEvent);
      }
    }, 100);

    log('Force close complete');
  }

  // Run the fix with retries
  function runWithRetries() {
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryFix = () => {
      attempts++;
      log(`Fix attempt ${attempts}/${maxAttempts}`);
      
      if (applyFinalFix()) {
        log('Fix successful!');
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryFix, 1000);
      } else {
        log('Max attempts reached - fix failed');
      }
    };
    
    tryFix();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runWithRetries);
  } else {
    runWithRetries();
  }

  // Watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if navigation was added
        const hasNav = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (
            node.matches && node.matches('nav') ||
            node.querySelector && node.querySelector('nav')
          )
        );
        
        if (hasNav && !isFixed) {
          log('Navigation detected in DOM changes, retrying fix');
          setTimeout(runWithRetries, 500);
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  log('Final mobile nav fix script loaded');
})();
