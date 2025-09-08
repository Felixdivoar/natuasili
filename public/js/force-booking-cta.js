/**
 * Runtime hard-guard for booking CTA clickability
 * Ensures booking buttons remain clickable even if other code interferes
 */
(function ensureBookingCTAClickable() {
  "use strict";

  const SELECTORS = [
    '#bookNowBtn',
    '[data-booking-cta="true"]',
    '.book-now-btn',
    '.btn-book-now'
  ];

  function makeClickable(element) {
    if (!element) return;

    // Force clickability styles
    element.style.pointerEvents = "auto";
    element.style.zIndex = "1001";
    element.style.position = "relative";
    element.style.touchAction = "manipulation";

    // Ensure minimum touch target size
    const rect = element.getBoundingClientRect();
    if (rect.height < 44) {
      element.style.minHeight = "44px";
    }
    if (rect.width < 44) {
      element.style.minWidth = "44px";
    }

    // Remove any blocking overlays from parent containers
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 10) {
      const style = getComputedStyle(parent);
      if (style.pointerEvents === 'none') {
        parent.style.pointerEvents = 'auto';
      }
      parent = parent.parentElement;
      depth++;
    }

    // Bind click handler if not already bound
    if (!element.__bookingBound) {
      const originalHandler = element.onclick;
      
      element.addEventListener("click", function(e) {
        // Ensure event propagates correctly
        e.stopPropagation();
        
        // Dispatch custom event for listeners
        element.dispatchEvent(new CustomEvent("book-now-click", {
          bubbles: true,
          detail: { target: element }
        }));
        
        // Call original handler if it exists
        if (originalHandler && typeof originalHandler === 'function') {
          originalHandler.call(element, e);
        }
      }, { passive: false });

      // Handle keyboard events
      element.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          element.click();
        }
      }, { passive: false });

      element.__bookingBound = true;
    }
  }

  function bindAllCTAs() {
    SELECTORS.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(makeClickable);
      } catch (e) {
        console.warn('BookingCTA: Error binding selector:', selector, e);
      }
    });
  }

  // Initial binding
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAllCTAs);
  } else {
    bindAllCTAs();
  }

  // Re-bind on DOM mutations (handles dynamic content)
  const observer = new MutationObserver(function(mutations) {
    let shouldRebind = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            const element = node;
            // Check if the added node contains booking CTAs
            SELECTORS.forEach(selector => {
              try {
                if (element.matches && element.matches(selector)) {
                  makeClickable(element);
                } else if (element.querySelector) {
                  const found = element.querySelectorAll(selector);
                  found.forEach(makeClickable);
                }
              } catch (e) {
                // Ignore selector errors
              }
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    attributeOldValue: false
  });

  // Periodic check as fallback (every 2 seconds)
  setInterval(bindAllCTAs, 2000);

  // Expose global function for manual triggering
  window.rebindBookingCTAs = bindAllCTAs;

  console.log('🎯 BookingCTA: Click protection active');
})();