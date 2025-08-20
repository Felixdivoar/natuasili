import { useEffect } from 'react';

export const useInteractiveBookingForm = () => {
  useEffect(() => {
    // Partner link fixer for non-detail pages only
    function fixPartnerLinks() {
      // Skip fixing partner links on experience detail pages
      const isDetailPage = document.querySelector('.experience-detail, .page-experience, body.page-experience');
      if (isDetailPage) {
        // Make partner names plain text on detail pages
        document.querySelectorAll('.experience-detail .partner-name, .page-experience .partner-name').forEach(el => {
          if (el.tagName === 'A') {
            const span = document.createElement('span');
            span.className = el.className.replace(/\bpartner-link\b/g, '').trim();
            span.classList.add('partner-name');
            span.textContent = el.textContent || '';
            el.replaceWith(span);
          }
        });
        return;
      }

      // Fix partner links on all other pages
      const normalizeSlug = (txt = '') => {
        return txt.trim().toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      };

      document.querySelectorAll('.partner-link, .partner-name, .by-partner a, .experience-partner a').forEach(el => {
        const element = el as HTMLElement;
        const text = (element.textContent || '').trim();
        const slug = element.dataset.partnerSlug ? element.dataset.partnerSlug : normalizeSlug(text);
        if (!slug) return;

        if (element.tagName !== 'A') {
          const a = document.createElement('a');
          a.className = element.className ? element.className + ' partner-link' : 'partner-link';
          a.textContent = text;
          a.href = `/partners/${slug}`;
          a.setAttribute('aria-label', `View ${text} partner page`);
          element.replaceWith(a);
        } else {
          const linkElement = element as HTMLAnchorElement;
          if (!linkElement.getAttribute('href') || linkElement.getAttribute('href') === '#') {
            linkElement.href = `/partners/${slug}`;
          }
          linkElement.setAttribute('aria-label', `View ${text} partner page`);
        }
      });
    }

    // Initialize
    fixPartnerLinks();

    // Observe SPA updates for partner links only
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) {
            fixPartnerLinks();
          }
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
    };
  }, []);
};