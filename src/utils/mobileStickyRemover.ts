// Mobile Sticky Element Remover
// Dynamically detects and removes unwanted sticky/fixed elements on mobile

export const initMobileStickyRemover = () => {
  // Only run on mobile devices
  if (window.innerWidth > 768) return;

  // Whitelist your REAL header(s) here
  const WHITELIST_IDS = ['mainHeader'];
  const WHITELIST_CLASSES = ['site-header', 'main-header', 'primary-nav'];

  function isWhitelisted(el: Element): boolean {
    if (!el) return false;
    if (el.id && WHITELIST_IDS.includes(el.id)) return true;
    return WHITELIST_CLASSES.some(c => el.classList?.contains(c));
  }

  function isRogueBottomBar(el: Element): boolean {
    try {
      if (!(el instanceof HTMLElement)) return false;
      if (isWhitelisted(el)) return false;

      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed') return false;

      // at the very bottom and spanning the width
      const atBottom = (parseInt(cs.bottom, 10) === 0) || cs.bottom === '0px';
      const wide = (parseInt(cs.width, 10) >= window.innerWidth * 0.9);

      if (!atBottom || !wide) return false;

      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
      // looks like your pasted strip
      const looksLike = txt.includes('search') && txt.includes('account') && txt.includes('currency');

      // also catch emoji-only variants
      const hasEmojis = /🔎|👤|🪙|💱|💵|💶|💷|💴/.test(el.innerText || '');

      return looksLike || hasEmojis;
    } catch (e) { 
      return false; 
    }
  }

  function isRogueTopBar(el: Element): boolean {
    try {
      if (!(el instanceof HTMLElement)) return false;
      if (isWhitelisted(el)) return false;

      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed') return false;

      const atTop = (parseInt(cs.top, 10) === 0) || cs.top === '0px';
      if (!atTop) return false;

      const wide = (el.offsetWidth >= window.innerWidth * 0.9);
      const short = (el.offsetHeight > 0 && el.offsetHeight <= 120); // thin strip
      if (!wide || !short) return false;

      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const looksLike = txt.includes('search') && (txt.includes('account') || txt.includes('currency'));
      const hasEmojis = /🔎|👤|💱|💵|💶|💷|💴/.test(el.innerText || '');

      return looksLike || hasEmojis;
    } catch (e) { 
      return false; 
    }
  }

  function removeRogueBars(root: Document | Element = document): number {
    const all = root.querySelectorAll('body *');
    let removed = 0;
    
    for (const el of all) {
      if (isRogueBottomBar(el) || isRogueTopBar(el)) {
        el.classList.add('__kill-bottom-bar');
        el.remove();
        removed++;
      }
    }
    return removed;
  }

  // Initial sweep
  removeRogueBars();

  // Guard against runtime inserts
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) {
            const element = n as Element;
            if (isRogueBottomBar(element) || isRogueTopBar(element)) {
              element.classList.add('__kill-bottom-bar');
              element.remove();
            } else {
              // check its children
              removeRogueBars(element);
            }
          }
        });
      } else if (m.type === 'attributes' && m.target) {
        const target = m.target as Element;
        if (isRogueBottomBar(target) || isRogueTopBar(target)) {
          target.classList.add('__kill-bottom-bar');
          target.remove();
        }
      }
    }
  });

  mo.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  // Safety: also remove on viewport changes (mobile keyboards, rotations)
  ['resize', 'orientationchange', 'visibilitychange'].forEach(ev =>
    window.addEventListener(ev, () => removeRogueBars(), { passive: true })
  );
};