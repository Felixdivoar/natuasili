/**
 * Book Now Button Testing Utilities
 * 
 * Use these functions in DevTools console to test and debug Book Now button functionality
 * on mobile devices and different screen sizes.
 */

// Test all Book Now buttons on the current page
export function testAllBookNowButtons() {
  const buttons = document.querySelectorAll('.book-now');
  console.log(`🔍 Found ${buttons.length} Book Now buttons on this page`);
  
  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    const styles = window.getComputedStyle(button);
    
    console.log(`📱 Button ${index + 1}:`, {
      element: button,
      text: button.textContent?.trim(),
      isVisible: styles.visibility === 'visible' && styles.display !== 'none',
      isClickable: styles.pointerEvents !== 'none',
      hasMinTapSize: rect.width >= 44 && rect.height >= 44,
      zIndex: styles.zIndex,
      position: styles.position,
      dimensions: { width: rect.width, height: rect.height },
      center: { 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      }
    });
    
    // Test what element is actually at the center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const elementAtCenter = document.elementFromPoint(centerX, centerY);
    
    if (elementAtCenter !== button) {
      console.warn(`⚠️ Button ${index + 1} is BLOCKED by:`, elementAtCenter);
    } else {
      console.log(`✅ Button ${index + 1} is clickable`);
    }
  });
}

// Test mobile-specific functionality
export function testMobileBookNowFunctionality() {
  console.log('📱 Testing mobile Book Now functionality...');
  
  // Check if mobile sticky bar is visible
  const mobileSticky = document.querySelector('.mobile-sticky-booking');
  if (mobileSticky) {
    const stickyButton = mobileSticky.querySelector('.book-now');
    console.log('📱 Mobile sticky bar found:', {
      visible: window.getComputedStyle(mobileSticky).display !== 'none',
      zIndex: window.getComputedStyle(mobileSticky).zIndex,
      stickyButton: !!stickyButton,
      stickyButtonClickable: stickyButton ? window.getComputedStyle(stickyButton).pointerEvents !== 'none' : false
    });
  }
  
  // Check viewport and responsive behavior
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024
  };
  
  console.log('📱 Viewport info:', viewport);
  
  // Test touch events if available
  if ('ontouchstart' in window) {
    console.log('✅ Touch events supported');
  } else {
    console.log('⚠️ Touch events not supported (desktop environment)');
  }
  
  testAllBookNowButtons();
}

// Simulate mobile viewport for testing
export function simulateMobileViewport() {
  // Add a temporary style to simulate mobile viewport
  const mobileTestStyle = document.createElement('style');
  mobileTestStyle.id = 'mobile-test-style';
  mobileTestStyle.innerHTML = `
    @media (max-width: 1024px) {
      .book-now {
        outline: 3px solid red !important;
        background-color: rgba(255, 0, 0, 0.1) !important;
      }
    }
  `;
  
  document.head.appendChild(mobileTestStyle);
  
  console.log('📱 Mobile test styles applied. Book Now buttons should have red outlines on mobile viewports.');
  console.log('📱 Open DevTools, toggle device emulation, and refresh to see mobile-specific styling.');
  
  return () => {
    const style = document.getElementById('mobile-test-style');
    if (style) {
      document.head.removeChild(style);
      console.log('📱 Mobile test styles removed.');
    }
  };
}

// Check for common blocking elements
export function checkForBlockingElements() {
  console.log('🔍 Checking for elements that commonly block mobile taps...');
  
  const commonBlockers = [
    '.header-overlay',
    '.hero-mask', 
    '.carousel-shield',
    '.cookie-bar',
    '.backdrop',
    '.overlay',
    '[style*="position: fixed"]',
    '[style*="position: absolute"]'
  ];
  
  commonBlockers.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        console.log(`🚨 Potential blocker found: ${selector}`, {
          element,
          zIndex: styles.zIndex,
          pointerEvents: styles.pointerEvents,
          position: styles.position,
          dimensions: { width: rect.width, height: rect.height }
        });
      }
    });
  });
}

// Manual click test
export function manualClickTest() {
  const buttons = document.querySelectorAll('.book-now');
  console.log(`🎯 Manual click test - Click any Book Now button and check console for logs`);
  
  buttons.forEach((button, index) => {
    const htmlButton = button as HTMLElement;
    
    button.addEventListener('click', function(e: MouseEvent) {
      console.log(`🎯 Button ${index + 1} clicked!`, {
        button: this,
        event: e,
        timestamp: new Date().toISOString(),
        coordinates: { x: e.clientX, y: e.clientY }
      });
    }, { capture: true });
  });
}

// Make functions available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).bookNowTest = {
    testAllBookNowButtons,
    testMobileBookNowFunctionality,
    simulateMobileViewport,
    checkForBlockingElements,
    manualClickTest
  };
  
  console.log('📱 Book Now testing utilities loaded! Use window.bookNowTest to access functions.');
}