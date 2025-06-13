// DOM Inspector Script
// This will log the mobile navigation structure to the console when it's open
// Add this to the start of emergency-nav-fix.js

(function() {
  // Debug level: 0=off, 1=basic, 2=verbose
  const DEBUG_LEVEL = 2;
  
  function log(level, ...args) {
    if (level <= DEBUG_LEVEL) {
      console.log(...args);
    }
  }
  
  // Function to inspect the DOM structure in detail
  function inspectMobileNavigation() {
    log(1, "🔍 DOM INSPECTOR: Analyzing mobile navigation structure");
    
    // Find the navigation element
    const navElements = document.querySelectorAll('nav');
    log(1, `Found ${navElements.length} navigation elements`);
    
    navElements.forEach((nav, i) => {
      log(1, `Navigation #${i+1}:`, nav);
      log(2, `  - classes: ${nav.className}`);
      log(2, `  - aria-expanded: ${nav.getAttribute('aria-expanded')}`);
      log(2, `  - aria-label: ${nav.getAttribute('aria-label')}`);
      log(2, `  - style: ${nav.getAttribute('style')}`);
      
      // Find all close buttons
      const closeButtons = nav.querySelectorAll('button');
      log(1, `  Found ${closeButtons.length} buttons in navigation #${i+1}`);
      
      closeButtons.forEach((btn, j) => {
        const isXButton = btn.querySelector('svg path[d*="M6 18L18 6"]') || 
                        btn.querySelector('svg path[d*="M6 6l12 12"]');
        
        if (isXButton) {
          log(1, `  🎯 CLOSE BUTTON #${j+1} FOUND:`, btn);
          log(2, `    - className: ${btn.className}`);
          log(2, `    - id: ${btn.id}`);
          log(2, `    - aria-label: ${btn.getAttribute('aria-label')}`);
          log(2, `    - onClick attached: ${!!btn.onclick}`);
          log(2, `    - event listeners: ${btn._reactListeners ? 'React listeners attached' : 'No React listeners'}`);
          
          // Test clicking it programmatically
          log(1, "    Attempting to simulate click on close button...");
          try {
            // Store event handlers
            const originalHandlers = {
              click: btn.onclick,
              mousedown: btn.onmousedown,
              mouseup: btn.onmouseup
            };
            
            // Track if React's event handler was called
            let reactHandlerCalled = false;
            
            // Override event handlers temporarily to see if they're being called
            btn.onclick = function(e) {
              log(1, "    👉 Native onClick handler called");
              reactHandlerCalled = true;
              if (originalHandlers.click) return originalHandlers.click.call(this, e);
            };
            
            // Later we'll actually click it
          } catch (err) {
            log(1, "    ❌ Error inspecting button:", err);
          }
        }
      });
    });
    
    // Look for overlays
    const overlays = document.querySelectorAll('.mobile-overlay, [role="dialog"], .MobileOverlay');
    log(1, `Found ${overlays.length} overlay elements`);
    overlays.forEach((overlay, i) => {
      log(1, `Overlay #${i+1}:`, overlay);
      log(2, `  - classes: ${overlay.className}`);
      log(2, `  - style: ${overlay.getAttribute('style')}`);
      log(2, `  - aria-modal: ${overlay.getAttribute('aria-modal')}`);
      log(2, `  - onClick attached: ${!!overlay.onclick}`);
    });
    
    // Check for React's root element and state
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement._reactRootContainer) {
      log(1, "React root container found, React app is mounted");
    }
    
    // Capture and log all click events for a period
    const clickCapture = function(e) {
      log(1, "📌 Click event captured on:", e.target);
      log(2, "  - Event propagation path:", e.composedPath().map(el => 
        el.tagName ? `${el.tagName.toLowerCase()}${el.className ? `.${el.className.split(' ')[0]}` : ''}` : el
      ).join(' > '));
    };
    
    document.addEventListener('click', clickCapture, true);
    log(1, "Click event capturing enabled - all clicks will be logged");
    
    setTimeout(() => {
      document.removeEventListener('click', clickCapture, true);
      log(1, "Click event capturing disabled after 10 seconds");
    }, 10000);
    
    return "DOM inspection complete. Check console for detailed analysis.";
  }
  
  // Run the inspection when the page loads and also whenever the navigation might open
  window.inspectMobileNavigation = inspectMobileNavigation;
  
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(inspectMobileNavigation, 2000);
  });
  
  // Also watch for menu button clicks
  document.addEventListener('click', function(e) {
    // Check if this is the menu button (hamburger)
    if (e.target.closest('button[aria-label="Open navigation menu"]')) {
      log(1, "🍔 Menu button clicked, scheduling inspection");
      setTimeout(inspectMobileNavigation, 500);
    }
  }, true);
})();
