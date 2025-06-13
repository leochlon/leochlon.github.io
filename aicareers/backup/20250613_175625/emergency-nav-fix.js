// This file provides a direct fix for the mobile navigation X button
// It uses direct DOM manipulation to force the mobile menu to close
// This is an emergency fix with high priority debugging

(function() {
  // Enable debug mode to see what's happening
  const DEBUG = true;
  
  // Run this script immediately and also after the document is fully loaded
  fixNavNow();
  document.addEventListener('DOMContentLoaded', function() {
    fixNavNow();
    setTimeout(fixNavNow, 1000);
    setTimeout(fixNavNow, 2000);
  });

  // Watch for route changes in single page apps
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      fixNavNow();
      setTimeout(fixNavNow, 500);
    }
  }).observe(document, {subtree: true, childList: true});

  // URGENT: Direct event listener on the document for the X button
  document.addEventListener('click', function(e) {
    // Find any button with an X icon or class
    const button = e.target.closest('button, .mobile-nav-x-btn');
    if (!button) return;
    
    // Check if it's an X button by looking at its content or class
    const isXButton = 
      (button.classList.contains('mobile-nav-x-btn')) ||
      (button.querySelector('svg path[d*="M6 18L18 6"]')) ||
      (button.querySelector('svg path[d*="M6 6l12 12"]')) ||
      (button.textContent === '×') ||
      (button.textContent === 'X') ||
      (button.innerHTML.includes('&times;')) ||
      (button.getAttribute('aria-label') === 'Close navigation menu');
      
    if (isXButton) {
      if (DEBUG) console.log('✅ X BUTTON CLICKED!', button);
      
      // STOP EVENT PROPAGATION COMPLETELY
      e.stopPropagation();
      e.preventDefault();
      e.cancelBubble = true;
      
      // FORCE CLOSE NOW!
      forceCloseMenu();
      return false;
    }
  }, true); // Use capturing phase to catch early
  
  // Directly manipulate React's state via a global variable
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.closeMobileNav = true;
  
  // Force close the mobile menu by any means necessary
  function forceCloseMenu() {
    if (DEBUG) console.log('🚨 FORCING MENU CLOSE - EMERGENCY MODE');
    
    // Set global flags that React might check
    window.__FORCE_CLOSE_MOBILE_NAV__ = true;
    window.__isMenuOpen = false;
    
    // 1. Dispatch MANY custom events for different React implementations
    ['forceCloseMobileNav', 'forceCloseMenu', 'closeMobileMenu', 'closeNavigation', 'toggleMenu', 'menuClose'].forEach(eventName => {
      document.dispatchEvent(new CustomEvent(eventName, { 
        bubbles: true,
        detail: { force: true }
      }));
      if (DEBUG) console.log(`🔔 Dispatched event: ${eventName}`);
    });
    
    // 2. Find and click the mobile overlay directly
    const overlays = document.querySelectorAll('.mobile-overlay, [role="dialog"], .overlay, .backdrop, .MobileOverlay, .modal-backdrop');
    if (overlays.length > 0) {
      if (DEBUG) console.log(`🎯 Found ${overlays.length} overlays to click`);
      overlays.forEach(overlay => {
        overlay.click();
        overlay.style.display = 'none';
      });
    }
    
    // 3. Direct DOM manipulation - remove mobile menu elements
    document.querySelectorAll('.mobile-menu, .mobile-nav, [aria-expanded="true"]').forEach(el => {
      if (DEBUG) console.log('🗑️ Removing element', el);
      el.setAttribute('aria-expanded', 'false');
      el.style.transform = 'translateX(-100%)';
    });
    
    // 4. Find and click any other close buttons that might exist
    document.querySelectorAll('button[aria-label="Close"], button.close-btn, .close-button').forEach(btn => {
      if (DEBUG) console.log('🔘 Clicking another close button', btn);
      btn.click();
    });
    
    // 5. Click outside the navigation - simulate clicks at different positions
    setTimeout(() => {
      const clickEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.body.dispatchEvent(clickEvent);
      if (DEBUG) console.log('👆 Dispatched body click');
      
      // Also try clicking main content area
      const mainContent = document.querySelector('main, #main-content');
      if (mainContent) {
        mainContent.dispatchEvent(clickEvent);
        if (DEBUG) console.log('👆 Clicked main content');
      }
    }, 50);
    
    // 6. NUCLEAR OPTION: Remove all overlay elements from DOM
    setTimeout(() => {
      document.querySelectorAll('.mobile-overlay, [role="dialog"][aria-modal="true"]').forEach(overlay => {
        if (DEBUG) console.log('💣 NUCLEAR OPTION: Forcibly removing overlay', overlay);
        overlay.style.opacity = '0';
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        
        // Try to force React to update by modifying the element
        overlay.setAttribute('data-force-closed', 'true');
      });
      
      // Try to force React to reset state
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) {
        try {
          window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.emit('forceCloseMenu');
        } catch (e) {
          // Ignore errors
        }
      }
    }, 100);
  }
  
  function fixNavNow() {
    if (DEBUG) console.log('🔧 RUNNING EMERGENCY MOBILE NAV FIX');
    
    // Find all buttons that look like X buttons
    const xButtons = [];
    
    // Find using different selectors
    document.querySelectorAll('button, .mobile-nav-x-btn').forEach(button => {
      // Check all possible ways it could be an X button
      const svg = button.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d')) {
          const d = path.getAttribute('d');
          if (d.includes('M6 18L18 6') || d.includes('M6 6l12 12')) {
            xButtons.push(button);
          }
        }
      }
      
      // Check by aria-label
      if (button.getAttribute('aria-label') === 'Close navigation menu') {
        xButtons.push(button);
      }
      
      // Check by class
      if (button.classList.contains('mobile-nav-x-btn')) {
        xButtons.push(button);
      }
    });
    
    if (DEBUG) console.log(`🔍 Found ${xButtons.length} X buttons to fix`, xButtons);
    
    // Fix each X button
    xButtons.forEach(button => {
      // Skip if already fixed
      if (button.hasAttribute('data-super-fixed')) return;
      
      // Mark as super-fixed
      button.setAttribute('data-super-fixed', 'true');
      
      // Add our direct click handler with capturing
      button.addEventListener('click', function xButtonHandler(e) {
        if (DEBUG) console.log('⚡ X button direct handler fired');
        e.stopPropagation();
        e.preventDefault();
        forceCloseMenu();
        return false;
      }, true);
      
      // Also add mousedown handler
      button.addEventListener('mousedown', function(e) {
        if (DEBUG) console.log('👇 X button mousedown');
        e.stopPropagation();
      }, true);
      
      // Make the button more visible for debugging
      if (DEBUG) {
        button.style.position = 'relative';
        button.style.zIndex = '9999';
      }
      
      if (DEBUG) console.log('🔨 Fixed X button', button);
    });
    
    // Watch for future X buttons with a mutation observer
    const observer = new MutationObserver((mutations) => {
      let shouldFix = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          shouldFix = true;
          break;
        }
      }
      if (shouldFix) {
        if (DEBUG) console.log('👀 DOM changed, running fix again');
        fixNavNow();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
