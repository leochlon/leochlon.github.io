// This file provides a direct fix for the mobile navigation X button
// It works by attaching event listeners directly to DOM elements
// Place this script in public folder to be loaded directly

(function() {
  // Run this after the document is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixMobileNavigation, 1000);
  });

  // For single page apps, also watch for route changes
  let lastUrl = location.href; 
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(fixMobileNavigation, 500);
    }
  }).observe(document, {subtree: true, childList: true});

  // Add global click event listener to intercept all clicks on X buttons
  document.addEventListener('click', function(e) {
    // Check if this is a click on an X button or something inside it
    const closeButton = e.target.closest('button');
    if (closeButton) {
      const svg = closeButton.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d') && 
            (path.getAttribute('d').includes('M6 18L18 6') || 
             path.getAttribute('d').includes('M6 6l12 12'))) {
          console.log('X button clicked via document handler');
          e.stopPropagation();
          e.preventDefault();
          
          // Directly force close the mobile menu
          forceCloseMobileNav();
          return false;
        }
      }
    }
  }, true); // Use capturing phase to intercept early

  // Helper function to force close the mobile navigation
  function forceCloseMobileNav() {
    console.log('Forcing mobile navigation to close');
    
    // Try multiple approaches to ensure the menu closes
    
    // 1. Dispatch custom events that React components can listen for
    document.dispatchEvent(new CustomEvent('forceCloseMobileNav', { bubbles: true }));
    document.dispatchEvent(new CustomEvent('forceCloseMenu', { bubbles: true }));
    
    // 2. Try to click on the overlay directly
    const overlay = document.querySelector('.mobile-overlay, [role="dialog"]');
    if (overlay) {
      overlay.click();
    }
    
    // 3. Set a global flag that can be checked in React components
    window.__FORCE_CLOSE_MOBILE_NAV = true;
    
    // 4. Click outside the navigation to trigger any click-outside handlers
    setTimeout(() => {
      document.body.click();
    }, 50);
    
    // 5. Create and dispatch a mousedown event outside the navigation
    setTimeout(() => {
      const clickEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.body.dispatchEvent(clickEvent);
    }, 100);
  }

  function fixMobileNavigation() {
    console.log('Fixing mobile navigation X button...');
    
    // Find and fix X buttons in mobile navigation
    const findAndFixCloseButtons = () => {
      // Target navigation elements that might contain our close button
      const navElements = document.querySelectorAll('nav');
      
      navElements.forEach(nav => {
        // Find the X button inside this navigation
        const buttons = nav.querySelectorAll('button');
        
        buttons.forEach(button => {
          // Look for SVG path with X icon signature
          const svg = button.querySelector('svg');
          if (!svg) return;
          
          const path = svg.querySelector('path');
          if (!path) return;
          
          const d = path.getAttribute('d');
          if (!d) return;
          
          // Check if this looks like an X icon
          if (d.includes('M6 18L18 6') || d.includes('M6 6l12 12')) {
            console.log('Found X button in navigation, adding direct close handler');
            
            // Add a data attribute to avoid double-binding
            if (button.getAttribute('data-fixed-close')) return;
            button.setAttribute('data-fixed-close', 'true');
            button.classList.add('mobile-nav-x-btn');
            
            // Add our direct click handler
            button.addEventListener('click', function(e) {
              // Prevent event propagation
              e.stopPropagation();
              e.preventDefault();
              
              console.log('X button clicked, forcing menu close');
              forceCloseMobileNav();
              
              return false;
            }, true); // Use capturing phase
          }
        });
      });
    };
    
    // Run now and set up a mutation observer to continue fixing
    findAndFixCloseButtons();
    
    // Set up mutation observer to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          findAndFixCloseButtons();
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
