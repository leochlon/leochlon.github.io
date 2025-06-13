// Debug toolbar for mobile navigation issues
// This adds a persistent UI to help debug and force close the navigation

(function() {
  // Configuration
  const config = {
    enabled: true,
    position: 'bottom', // 'top' or 'bottom'
    autoHide: false,    // Hide after a delay
    hideDelay: 5000,    // Time in ms before hiding
    theme: 'dark'       // 'dark' or 'light'
  };
  
  function createDebugToolbar() {
    // Create container
    const toolbar = document.createElement('div');
    toolbar.id = 'nav-debug-toolbar';
    toolbar.style.position = 'fixed';
    toolbar.style.left = '0';
    toolbar.style.right = '0';
    toolbar.style.zIndex = '999999';
    toolbar.style.padding = '10px';
    toolbar.style.textAlign = 'center';
    toolbar.style.backgroundColor = config.theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
    toolbar.style.color = config.theme === 'dark' ? '#fff' : '#000';
    toolbar.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    toolbar.style.fontFamily = 'Arial, sans-serif';
    toolbar.style.fontSize = '14px';
    toolbar.style.backdropFilter = 'blur(5px)';
    
    // Position it
    if (config.position === 'top') {
      toolbar.style.top = '0';
      toolbar.style.borderBottomLeftRadius = '10px';
      toolbar.style.borderBottomRightRadius = '10px';
    } else {
      toolbar.style.bottom = '0';
      toolbar.style.borderTopLeftRadius = '10px';
      toolbar.style.borderTopRightRadius = '10px';
    }
    
    // Add force close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '🚫 FORCE CLOSE NAV';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 15px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.marginRight = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    
    closeButton.onclick = function() {
      forceCloseNavigation();
      
      // Visual feedback
      closeButton.textContent = '✅ CLOSING...';
      setTimeout(() => {
        closeButton.textContent = '🚫 FORCE CLOSE NAV';
      }, 1000);
    };
    
    // Add DOM inspector button
    const inspectButton = document.createElement('button');
    inspectButton.textContent = '🔍 INSPECT NAV';
    inspectButton.style.backgroundColor = '#2196f3';
    inspectButton.style.color = 'white';
    inspectButton.style.border = 'none';
    inspectButton.style.padding = '8px 15px';
    inspectButton.style.borderRadius = '5px';
    inspectButton.style.cursor = 'pointer';
    
    inspectButton.onclick = function() {
      if (window.inspectMobileNavigation) {
        window.inspectMobileNavigation();
        
        // Visual feedback
        inspectButton.textContent = '✅ INSPECTING...';
        setTimeout(() => {
          inspectButton.textContent = '🔍 INSPECT NAV';
        }, 1000);
      } else {
        console.log("Nav inspection function not available");
        inspectButton.textContent = '❌ INSPECTION FAILED';
        setTimeout(() => {
          inspectButton.textContent = '🔍 INSPECT NAV';
        }, 1000);
      }
    };
    
    // Add status info
    const statusInfo = document.createElement('div');
    statusInfo.style.marginTop = '5px';
    statusInfo.style.fontSize = '12px';
    statusInfo.style.color = config.theme === 'dark' ? '#aaa' : '#666';
    statusInfo.textContent = 'Debug toolbar active - Press buttons above to fix navigation';
    
    // Add all elements to toolbar
    toolbar.appendChild(closeButton);
    toolbar.appendChild(inspectButton);
    toolbar.appendChild(document.createElement('br'));
    toolbar.appendChild(statusInfo);
    
    // Add to document
    document.body.appendChild(toolbar);
    
    // Auto-hide after delay if configured
    if (config.autoHide) {
      setTimeout(() => {
        toolbar.style.opacity = '0.2';
        toolbar.style.transition = 'opacity 0.5s';
        
        // Show on hover
        toolbar.onmouseover = function() {
          toolbar.style.opacity = '1';
        };
        
        toolbar.onmouseout = function() {
          toolbar.style.opacity = '0.2';
        };
      }, config.hideDelay);
    }
    
    // Return the toolbar
    return toolbar;
  }
  
  // Function to force close the navigation
  function forceCloseNavigation() {
    console.log("🚨 DEBUG TOOLBAR: Forcing navigation to close");
    
    // Try all possible ways to close the menu
    
    // 1. Check if our patch script has a force close function
    if (window.__navFix && window.__navFix.forceMenuClose) {
      window.__navFix.forceMenuClose();
      console.log("Called __navFix.forceMenuClose()");
    }
    
    // 2. Check if the navigation component exposes a close function
    if (window.__navigationComponent && window.__navigationComponent.forceClose) {
      window.__navigationComponent.forceClose();
      console.log("Called __navigationComponent.forceClose()");
    }
    
    // 3. Check if we have a direct reference to the nav close button
    if (window.__navCloseButton) {
      window.__navCloseButton.click();
      console.log("Clicked __navCloseButton directly");
    }
    
    // 4. Check if we have a direct reference to the mobile overlay
    if (window.__mobileOverlay) {
      window.__mobileOverlay.click();
      console.log("Clicked __mobileOverlay directly");
    }
    
    // 5. Try to set the global force close flag
    window.__FORCE_CLOSE_MOBILE_NAV__ = true;
    console.log("Set __FORCE_CLOSE_MOBILE_NAV__ flag");
    
    // 6. Dispatch custom events
    ['forceCloseMobileNav', 'forceCloseMenu', 'closeMobileMenu', 
     'closeNavigation', 'toggleMenu', 'menuClose'].forEach(eventName => {
      document.dispatchEvent(new CustomEvent(eventName, { 
        bubbles: true,
        detail: { force: true }
      }));
      console.log(`Dispatched ${eventName} event`);
    });
    
    // 7. Try to find and click the mobile overlay
    const overlay = document.querySelector('.mobile-overlay, [role="dialog"]');
    if (overlay) {
      overlay.click();
      console.log("Clicked mobile overlay element");
    }
    
    // 8. Try to find and click the close button
    const closeButton = document.querySelector('button.mobile-nav-x-btn, button[aria-label="Close navigation menu"]');
    if (closeButton) {
      closeButton.click();
      console.log("Clicked mobile nav close button");
    }
    
    // 9. Nuclear option: direct style manipulation
    document.querySelectorAll('nav').forEach(nav => {
      if (window.getComputedStyle(nav).transform.includes('translateX(0')) {
        nav.style.transform = 'translateX(-100%)';
        console.log("Forced nav off-screen with style");
      }
    });
    
    console.log("Force close attempts complete");
  }
  
  // Add toolbar when DOM is ready
  if (config.enabled) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createDebugToolbar);
    } else {
      createDebugToolbar();
    }
  }
})();
