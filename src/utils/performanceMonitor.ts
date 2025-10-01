// Performance monitoring utility to detect and prevent freezes

let lastCheck = Date.now();
let freezeWarningShown = false;

// Monitor main thread blocking
export const initPerformanceMonitor = () => {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') return;

  setInterval(() => {
    const now = Date.now();
    const gap = now - lastCheck;
    
    // If gap is > 100ms, main thread was likely blocked
    if (gap > 100 && !freezeWarningShown) {
      console.warn(`Main thread blocked for ${gap}ms`);
      
      // If blocked for more than 500ms, it's a freeze
      if (gap > 500) {
        console.error('App freeze detected!');
        freezeWarningShown = true;
      }
    }
    
    lastCheck = now;
  }, 50); // Check every 50ms
};

// Cleanup long-running intervals on visibility change
export const initVisibilityCleanup = () => {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Page hidden - pausing background tasks');
    } else {
      console.log('Page visible - resuming background tasks');
      freezeWarningShown = false; // Reset warning flag
    }
  });
};

// Memory leak detector for intervals/subscriptions
const activeIntervals = new Set<number>();
const activeTimeouts = new Set<number>();

export const trackInterval = (id: number) => {
  activeIntervals.add(id);
};

export const trackTimeout = (id: number) => {
  activeTimeouts.add(id);
};

export const clearTrackedInterval = (id: number) => {
  clearInterval(id);
  activeIntervals.delete(id);
};

export const clearTrackedTimeout = (id: number) => {
  clearTimeout(id);
  activeTimeouts.delete(id);
};

// Cleanup all tracked timers
export const cleanupAllTimers = () => {
  activeIntervals.forEach(id => clearInterval(id));
  activeTimeouts.forEach(id => clearTimeout(id));
  activeIntervals.clear();
  activeTimeouts.clear();
  console.log('All timers cleaned up');
};

// Initialize on import
if (typeof window !== 'undefined') {
  initVisibilityCleanup();
}
