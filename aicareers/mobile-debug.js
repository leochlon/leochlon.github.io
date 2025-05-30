// Quick mobile debug script to check what's happening
console.log('🔍 Mobile Debug - Checking menu visibility');
console.log('Screen width:', window.innerWidth);
console.log('Screen height:', window.innerHeight);

// Check if we're in mobile viewport
const isMobile = window.innerWidth <= 768;
console.log('Is mobile viewport:', isMobile);

// Find the hamburger menu button
const menuButton = document.querySelector('button[aria-label="Open navigation menu"]');
console.log('Menu button found:', !!menuButton);
if (menuButton) {
  const styles = getComputedStyle(menuButton);
  console.log('Menu button display:', styles.display);
  console.log('Menu button visibility:', styles.visibility);
  console.log('Menu button opacity:', styles.opacity);
}

// Find the navigation sidebar
const nav = document.querySelector('nav[aria-label="Main navigation"]');
console.log('Navigation found:', !!nav);
if (nav) {
  const styles = getComputedStyle(nav);
  console.log('Nav display:', styles.display);
  console.log('Nav transform:', styles.transform);
  console.log('Nav width:', styles.width);
  console.log('Nav position:', styles.position);
}

// Check if isMenuOpen state
const overlay = document.querySelector('div[style*="backdrop-filter"]');
console.log('Mobile overlay present:', !!overlay);

setTimeout(() => {
  console.log('🔄 Rechecking after 1 second...');
  
  const menuButton2 = document.querySelector('button[aria-label="Open navigation menu"]');
  if (menuButton2) {
    const styles2 = getComputedStyle(menuButton2);
    console.log('Menu button display (after):', styles2.display);
  }
  
  const nav2 = document.querySelector('nav[aria-label="Main navigation"]');
  if (nav2) {
    const styles2 = getComputedStyle(nav2);
    console.log('Nav transform (after):', styles2.transform);
  }
}, 1000);
