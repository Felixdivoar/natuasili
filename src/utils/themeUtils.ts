// Theme utility functions
export const THEME_SLUGS: Record<string, string> = {
  'wildlife conservation': 'wildlife-conservation',
  'cultural exploration': 'cultural-exploration', 
  'conservation education': 'conservation-education'
};

export function getThemeSlug(themeLabel: string): string {
  const key = themeLabel.trim().toLowerCase().replace(/\s+/g, ' ');
  return THEME_SLUGS[key] || key.replace(/\s+/g, '-');
}

export function initializeThemeChips(): void {
  const ensureThemeChipsClickable = (root: Document | Element = document) => {
    root.querySelectorAll('.experience-theme .theme-chip, .experience-theme a').forEach(node => {
      const element = node as HTMLElement;
      const label = element.textContent?.trim() || '';
      const slug = getThemeSlug(label);
      const href = `/marketplace?theme=${encodeURIComponent(slug)}`;

      if (element.tagName !== 'A') {
        const a = document.createElement('a');
        a.className = element.className + ' theme-chip';
        a.href = href;
        a.textContent = label;
        a.setAttribute('aria-label', `View ${label} experiences`);
        element.replaceWith(a);
      } else {
        (element as HTMLAnchorElement).href = href;
        element.setAttribute('aria-label', `View ${label} experiences`);
      }
    });
  };

  const ensurePriceBadges = (root: Document | Element = document) => {
    const priceBlocks = root.querySelectorAll(
      '.landing-experiences .experience-card .price, ' +
      '.home-experiences .experience-card .price, ' +
      '.featured-experiences .experience-card .price, ' +
      '.experience-booking .price, .page-experience .booking .price, ' +
      '.checkout-page .price'
    );
    
    priceBlocks.forEach(p => {
      if (!p.querySelector('.price-badge')) {
        const span = document.createElement('span');
        span.className = 'price-badge';
        // Move existing nodes into the badge
        while (p.firstChild) {
          span.appendChild(p.firstChild);
        }
        p.appendChild(span);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureThemeChipsClickable();
    ensurePriceBadges();

    // Handle SPA re-renders
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              ensureThemeChipsClickable(node as Element);
              ensurePriceBadges(node as Element);
            }
          });
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true 
    });
  });
}

// Initialize on module load
if (typeof document !== 'undefined') {
  initializeThemeChips();
}