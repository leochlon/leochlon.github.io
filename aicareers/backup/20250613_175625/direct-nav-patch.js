// Direct patch for mobile navigation close button
// This uses direct DOM manipulation approach

(function() {
  // Configuration
  const DEBUG = true;
  const AGGRESSIVE_MODE = true;
  
  function log(...args) {
    if (DEBUG) console.log("🔧 [NavFix]", ...args);
  }
  
  // Run immediately and after load
  fixNavNow();
  
  document.addEventListener('DOMContentLoaded', function() {
    fixNavNow();
    // Re-run the fix multiple times to catch late-loading components
    setTimeout(fixNavNow, 1000);
    setTimeout(fixNavNow, 2000);
    setTimeout(fixNavNow, 3000);
  });
  
  // Monitor for React router navigation
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      log("URL changed, re-applying fix");
      fixNavNow();
      setTimeout(fixNavNow, 500);
    }
  }).observe(document, {subtree: true, childList: true});
  
  // Track all clicks on the page for debugging
  if (DEBUG) {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('button');
      if (target) {
        log(`Button clicked: ${target.getAttribute('aria-label') || target.textContent.trim() || 'unnamed button'}`);
      }
    }, true);
  }
  
  // Direct patch function for the close button
  function fixNavNow() {
    log("Running direct navigation fix");
    
    // 1. First approach: Replace all close button click handlers
    document.querySelectorAll('button').forEach(button => {
      // Check if it's a close button by various criteria
      const svg = button.querySelector('svg');
      if (!svg) return;
      
      const path = svg.querySelector('path');
      if (!path) return;
      
      const d = path.getAttribute('d');
      if (!d) return;
      
      const isXButton = d.includes('M6 18L18 6') || d.includes('M6 6l12 12');
      if (!isXButton) return;
      
      log("Found X button:", button);
      
      // Skip if already patched
      if (button.hasAttribute('data-direct-patched')) return;
      button.setAttribute('data-direct-patched', 'true');
      
      // Apply special styling to make it more obvious
      if (DEBUG) {
        button.style.position = 'relative';
        button.style.zIndex = '9999';
        button.style.boxShadow = '0 0 0 3px red';
      }
      
      // Store original click handler if it exists
      const originalClick = button.onclick;
      
      // Replace with our direct handler
      button.onclick = null; // Remove React's handler
      
      // Add our own handler with capturing
      button.addEventListener('click', function directCloseHandler(e) {
        log("X button clicked through direct handler!");
        e.stopPropagation();
        e.preventDefault();
        
        // Call our close function
        forceMenuClose();
        
        // Also try original handler as backup
        if (originalClick) {
          try {
            originalClick.call(this, e);
          } catch (err) {
            log("Error calling original handler:", err);
          }
        }
        
        return false;
      }, true);
      
      // Also add mousedown handler to capture early
      button.addEventListener('mousedown', function(e) {
        log("X button mousedown");
        e.stopPropagation();
      }, true);
      
      log("X button patched with direct handler");
    });
    
    // 2. Second approach: Directly modify React's setState functions
    if (AGGRESSIVE_MODE && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      try {
        log("Attempting to patch React's internal state");
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        
        // Add our force close function to the React DevTools hook
        hook.forceMenuClose = forceMenuClose;
        
        log("Added forceMenuClose function to React DevTools hook");
      } catch (err) {
        log("Error patching React:", err);
      }
    }
    
    // 3. Add global keyboard shortcut for closing (Escape key)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        log("Escape key pressed, trying to close menu");
        forceMenuClose();
      }
    });
    
    log("Navigation fix applied");
  }
  
  // Function to force close the menu using multiple methods
  function forceMenuClose() {
    log("FORCE CLOSING MENU");
    
    // 1. Set various global flags that React components might check
    window.__FORCE_CLOSE_MOBILE_NAV__ = true;
    window.__isMenuOpen = false;
    
    // 2. Dispatch custom events
    ['forceCloseMobileNav', 'forceCloseMenu', 'closeMobileMenu', 
     'closeNavigation', 'toggleMenu', 'menuClose'].forEach(eventName => {
      document.dispatchEvent(new CustomEvent(eventName, { 
        bubbles: true,
        detail: { force: true }
      }));
      log(`Dispatched ${eventName} event`);
    });
    
    // 3. Find and click any overlays
    const overlays = document.querySelectorAll('.mobile-overlay, [role="dialog"], .MobileOverlay');
    if (overlays.length > 0) {
      log(`Found ${overlays.length} overlays, clicking them`);
      overlays.forEach(overlay => {
        overlay.click();
        
        if (AGGRESSIVE_MODE) {
          // Also try to hide it directly
          overlay.style.display = 'none';
          overlay.style.opacity = '0';
        }
      });
    }
    
    // 4. Find the navigation component and force its state
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
      if (nav.hasAttribute('aria-expanded')) {
        nav.setAttribute('aria-expanded', 'false');
        log("Set nav aria-expanded to false");
      }
      
      if (AGGRESSIVE_MODE) {
        // Force transform the nav off-screen
        const style = window.getComputedStyle(nav);
        if (style.transform.includes('translateX(0') || !style.transform.includes('translateX(-')) {
          nav.style.transform = 'translateX(-100%)';
          log("Forced nav off-screen");
        }
      }
    });
    
    // 5. Try to find and click the menu open button (to toggle it closed)
    const menuButtons = document.querySelectorAll('button[aria-label="Open navigation menu"]');
    if (menuButtons.length > 0) {
      log("Found menu button, clicking it");
      // Only try this in aggressive mode as it might re-open the menu in some cases
      if (AGGRESSIVE_MODE) {
        menuButtons[0].click();
      }
    }
    
    // 6. Simulate clicks outside the menu
    setTimeout(() => {
      document.body.click();
      log("Clicked body element");
      
      const mainContent = document.querySelector('main, #main-content');
      if (mainContent) {
        mainContent.click();
        log("Clicked main content");
      }
    }, 50);
    
    // 7. Direct React component state modification (most aggressive)
    if (AGGRESSIVE_MODE && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      try {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.renderers) {
          log("Attempting direct React state modification");
          
          // This is very aggressive and might break things, but we're desperate
          Object.values(hook.renderers).forEach(renderer => {
            if (renderer && renderer.findFiberByHostInstance) {
              log("Found React renderer, attempting to modify component state");
              
              // Try to find App component by navigation element
              const navElement = document.querySelector('nav');
              if (navElement) {
                try {
                  const fiber = renderer.findFiberByHostInstance(navElement);
                  if (fiber && fiber.return) {
                    // Walk up the fiber tree to find component with isMenuOpen state
                    let current = fiber;
                    while (current) {
                      if (current.memoizedState && 
                          current.memoizedState.isMenuOpen !== undefined) {
                        log("Found component with isMenuOpen state:", current);
                        // Directly modify the state (DANGEROUS!)
                        current.memoizedState.isMenuOpen = false;
                        
                        // Force update
                        if (current.stateNode && current.stateNode.forceUpdate) {
                          current.stateNode.forceUpdate();
                          log("Forced component update");
                        }
                        break;
                      }
                      current = current.return;
                    }
                  }
                } catch (err) {
                  log("Error modifying React state:", err);
                }
              }
            }
          });
        }
      } catch (err) {
        log("Error in direct React modification:", err);
      }
    }
    
    log("Force close complete");
  }
  
  // Export functions to window for debugging
  window.__navFix = {
    forceMenuClose: forceMenuClose,
    fixNavNow: fixNavNow,
    debug: function(enable) {
      DEBUG = enable;
      log("Debug mode " + (enable ? "enabled" : "disabled"));
    }
  };
})();
