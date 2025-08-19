import { useEffect } from 'react';

export const useInteractiveBookingForm = () => {
  useEffect(() => {
    // Configurable selectors
    const peopleWrapSel = '.people-input';
    const peopleInputSel = '#people, input[name="people"]';
    const peopleErrSel = '.people-error';
    const bookBtnSel = '.btn-book-now';
    const detailSummarySel = '.booking-summary';
    const partnerNameSel = '.partner-name';

    // 1) People increment/decrement with limit guard
    function initPeopleControl(root: Document | Element = document) {
      root.querySelectorAll(peopleWrapSel).forEach(wrap => {
        const input = root.querySelector(peopleInputSel) as HTMLInputElement;
        const err = root.querySelector(peopleErrSel) as HTMLElement;
        const max = parseInt(wrap.getAttribute('data-max') || '0', 10) || 0;

        function clampAndValidate() {
          let val = parseInt(input?.value || '1', 10);
          if (isNaN(val) || val < 1) val = 1;
          if (input) input.value = val.toString();

          const over = (max > 0) && (val > max);
          // Show/hide error + disable Book now
          if (err) err.hidden = !over;
          root.querySelectorAll(bookBtnSel).forEach(b => {
            const btn = b as HTMLButtonElement;
            btn.disabled = over;
          });
          return !over;
        }

        wrap.querySelectorAll('.btn-step').forEach(btn => {
          btn.addEventListener('click', () => {
            const step = parseInt(btn.getAttribute('data-step') || '0', 10);
            if (input) {
              input.value = ((parseInt(input.value || '1', 10) || 1) + step).toString();
              clampAndValidate();
              reflectBookingDetails(root);
            }
          });
        });

        if (input) {
          input.addEventListener('input', () => { 
            clampAndValidate(); 
            reflectBookingDetails(root); 
          });
          clampAndValidate();
        }
      });
    }

    // 2) Reflect booking details into summary + Book now payload
    function reflectBookingDetails(root: Document | Element = document) {
      const title = (root.querySelector('.experience-title')?.textContent || '').trim();
      const location = (root.querySelector('.experience-location')?.textContent || '').trim();
      const dateInput = root.querySelector('input[name="date"]') as HTMLInputElement;
      const date = (dateInput?.value || '').trim();
      const peopleInput = root.querySelector(peopleInputSel) as HTMLInputElement;
      const people = (peopleInput?.value || '1').trim();
      const partner = (root.querySelector('.partner-name')?.textContent || '').trim();
      const price = (root.querySelector('.price .amount')?.textContent || '').trim();

      const summary = root.querySelector(detailSummarySel) as HTMLElement;
      if (summary && title) {
        summary.innerHTML = `
          <div class="summary-title">Booking Details</div>
          <div><strong>${title}</strong></div>
          <div>${location}</div>
          <div>People: ${people}${date ? ' · Date: ' + date : ''}</div>
          ${partner ? `<div>Partner: ${partner}</div>` : ''}
          ${price ? `<div>Price: ${price}</div>` : ''}
        `;
      }

      // Attach data to CTA for analytics or handoff
      const btn = root.querySelector(bookBtnSel) as HTMLButtonElement;
      if (btn) {
        btn.dataset.title = title;
        btn.dataset.location = location;
        btn.dataset.people = people;
        btn.dataset.date = date;
        btn.dataset.partner = partner;
        btn.dataset.price = price;
      }
    }

    // 3) Make all partner names clickable to partner page
    function initPartnerLinks(root: Document | Element = document) {
      root.querySelectorAll(partnerNameSel).forEach(node => {
        const slug = (node.getAttribute('data-partner-slug') || node.textContent || '')
          .trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g,'');
        if (!slug) return;
        
        if (node.tagName !== 'A') {
          const a = document.createElement('a');
          a.href = `/partners/${slug}`;
          a.textContent = node.textContent;
          a.className = (node.className || '') + ' partner-name';
          a.setAttribute('aria-label', `View ${node.textContent?.trim()} partner page`);
          node.replaceWith(a);
        } else if (!node.getAttribute('href')) {
          (node as HTMLAnchorElement).href = `/partners/${slug}`;
        }
      });
    }

    // Initialize all functionality
    initPeopleControl();
    reflectBookingDetails();
    initPartnerLinks();

    // Observe SPA/partial updates
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
              initPeopleControl(n as Element);
              reflectBookingDetails(n as Element);
              initPartnerLinks(n as Element);
            }
          });
        }
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
    };
  }, []);
};