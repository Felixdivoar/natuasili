/**
 * Tap Probe Utility - Helps diagnose what's blocking tap events on mobile
 * 
 * Usage in DevTools console:
 * ```
 * import { probeTapAt } from './utils/tapProbe';
 * probeTapAt(document.querySelector('.book-now'));
 * ```
 */

export function probeTapAt(el: HTMLElement | null) {
  if (!el) {
    console.log("[TapProbe] Element not found");
    return null;
  }

  const rect = el.getBoundingClientRect();
  const cx = Math.round(rect.left + rect.width / 2);
  const cy = Math.round(rect.top + rect.height / 2);
  const topElement = document.elementFromPoint(cx, cy);
  
  const computed = window.getComputedStyle(el);
  
  console.log("[TapProbe] Analysis:", {
    element: el,
    center: { cx, cy },
    topElementAtCenter: topElement,
    isBlocked: topElement !== el,
    styles: {
      pointerEvents: computed.pointerEvents,
      zIndex: computed.zIndex,
      position: computed.position,
      visibility: computed.visibility,
      opacity: computed.opacity,
      display: computed.display,
      transform: computed.transform,
    },
    dimensions: {
      width: rect.width,
      height: rect.height,  
      isMinSize: rect.width >= 44 && rect.height >= 44
    }
  });
  
  if (topElement && topElement !== el) {
    console.warn("[TapProbe] 🚨 Element is BLOCKED by:", topElement);
    console.log("[TapProbe] Blocker styles:", window.getComputedStyle(topElement));
  } else {
    console.log("[TapProbe] ✅ Element is NOT blocked");
  }
  
  return topElement;
}

/**
 * Quick check for all book now buttons on the page
 */
export function probeAllBookNowButtons() {
  const buttons = document.querySelectorAll('.book-now, [aria-label*="Book"], button:has-text("Book")');
  console.log(`[TapProbe] Found ${buttons.length} book now buttons`);
  
  buttons.forEach((button, index) => {
    console.log(`[TapProbe] Testing button ${index + 1}:`);
    probeTapAt(button as HTMLElement);
  });
}

/**
 * Visual debugging - adds outlines to all elements to see what's covering what
 */
export function showElementOutlines() {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      outline: 1px solid rgba(0,0,0,.05) !important;
    }
    .book-now {
      outline: 3px solid rgba(255,0,0,.8) !important;
      background-color: rgba(255,0,0,.1) !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log("[TapProbe] Element outlines enabled. Book now buttons highlighted in red.");
  
  return () => {
    document.head.removeChild(style);
    console.log("[TapProbe] Element outlines disabled.");
  };
}

// Make functions available globally for easy debugging
if (typeof window !== 'undefined') {
  (window as any).tapProbe = {
    probeTapAt,
    probeAllBookNowButtons,
    showElementOutlines
  };
}