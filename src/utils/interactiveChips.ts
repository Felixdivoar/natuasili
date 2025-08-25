// Interactive chips utility for blog categories and theme filters
export function initializeInteractiveChips() {
  const qsa = (s: string, r: Document | Element = document) => Array.from(r.querySelectorAll(s));
  
  function slugify(s: string) {
    return (s || '').trim().toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // Blog category chips
  function wireBlogCategories(root: Document | Element = document) {
    qsa('.post-category', root).forEach(el => {
      const element = el as HTMLElement;
      const slug = element.dataset.category ? element.dataset.category : slugify(element.textContent || '');
      
      if (element.tagName !== 'A') {
        const a = document.createElement('a');
        a.className = element.className + ' post-category';
        a.textContent = element.textContent;
        a.href = `/blog/category/${slug}`;
        element.replaceWith(a);
      } else if (!element.getAttribute('href')) {
        (element as HTMLAnchorElement).href = `/blog/category/${slug}`;
      }
    });
  }

  // Theme chips for experience listings
  const THEME_MAP: Record<string, string> = {
    'wildlife conservation': 'wildlife-conservation',
    'cultural exploration': 'cultural-exploration', 
    'conservation education': 'conservation-education',
    'wildlife': 'wildlife-conservation',
    'livelihoods': 'cultural-exploration',
    'education': 'conservation-education',
    'habitat': 'wildlife-conservation'
  };

  function slugTheme(label: string) {
    const k = (label || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return THEME_MAP[k] || k.replace(/\s+/g, '-');
  }

  function wireThemeChips(root: Document | Element = document) {
    qsa('.theme-chip, .experience-card .theme-chip, .experience-meta .theme-chip', root).forEach(chip => {
      const element = chip as HTMLElement;
      const label = (element.textContent || '').trim();
      const slug = slugTheme(label);
      const href = `/marketplace?theme=${encodeURIComponent(slug)}`;
      
      if (element.tagName !== 'A') {
        const a = document.createElement('a');
        a.className = element.className + ' theme-chip';
        a.textContent = label;
        a.href = href;
        element.replaceWith(a);
      } else if (!element.getAttribute('href')) {
        (element as HTMLAnchorElement).href = href;
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      wireBlogCategories();
      wireThemeChips();
    });
  } else {
    wireBlogCategories();
    wireThemeChips();
  }

  // Also export functions for manual initialization
  return {
    wireBlogCategories,
    wireThemeChips
  };
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeInteractiveChips();
}