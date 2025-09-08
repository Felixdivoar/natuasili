import React, { useEffect, useRef } from 'react';

interface InteractiveBookingHookOptions {
  enablePartnerLinks?: boolean;
}

export const useInteractiveBookingForm = (options: InteractiveBookingHookOptions = {}) => {
  const { enablePartnerLinks = true } = options;
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!enablePartnerLinks) return;

    // Partner link fixer for non-detail pages only
    function fixPartnerLinks() {
      try {
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
      } catch (error) {
        console.warn('Error fixing partner links:', error);
      }
    }

    // Initialize with error handling
    try {
      fixPartnerLinks();
    } catch (error) {
      console.warn('Error initializing partner links:', error);
    }

    // Observe SPA updates for partner links only
    try {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              fixPartnerLinks();
            }
          });
        });
      });
      
      observerRef.current.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
      });
    } catch (error) {
      console.warn('Error setting up mutation observer:', error);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enablePartnerLinks]);
};