import { useEffect } from 'react';

export const useInteractiveBookingForm = () => {
  useEffect(() => {
    // Helpers
    const qs = (s: string, r: Document | Element = document) => r.querySelector(s);
    const qsa = (s: string, r: Document | Element = document) => Array.from(r.querySelectorAll(s));
    const toMoney = (n: number) => Number.isFinite(n) ? n : 0;

    function normalizeSlug(txt = '') {
      return txt.trim().toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // Partner link fixer (listings + details)
    function fixPartnerLinks(root: Document | Element = document) {
      qsa('.partner-link, .partner-name, .by-partner a, .experience-partner a', root).forEach(el => {
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

    // Booking form logic
    function initBookingForm(form: HTMLFormElement) {
      const unit = Number(form.dataset.unitPrice || '0');
      const currency = form.dataset.currency || 'KES';
      const maxPeople = Number(form.dataset.maxPeople || '0');

      const inputPeople = qs('#people', form) as HTMLInputElement;
      const peopleWrap = qs('.people-input', form) as HTMLElement;
      const errEl = qs('.people-error', form) as HTMLElement;
      const dateInput = qs('#date', form) as HTMLInputElement;
      const summaryEl = qs('.booking-summary', form) as HTMLElement;
      const btnBook = qs('.btn-book-now', form) as HTMLButtonElement;

      // Hidden fields
      const fUnit = qs('#unit_price', form) as HTMLInputElement;
      const fCurr = qs('#currency', form) as HTMLInputElement;
      const fTotal = qs('#total_price', form) as HTMLInputElement;
      const fPart = qs('#partner_slug', form) as HTMLInputElement;
      const fExp = qs('#experience_slug', form) as HTMLInputElement;

      if (!inputPeople || !summaryEl) return;

      // Seed hidden fields
      if (fUnit) fUnit.value = unit.toString();
      if (fCurr) fCurr.value = currency;
      if (fPart) fPart.value = form.dataset.partnerSlug || '';
      if (fExp) fExp.value = form.dataset.experienceSlug || '';

      function clampAndValidate() {
        let val = parseInt(inputPeople.value || '1', 10);
        if (isNaN(val) || val < 1) val = 1;
        inputPeople.value = val.toString();

        const over = (maxPeople > 0) && (val > maxPeople);
        if (errEl) errEl.hidden = !over;
        if (btnBook) btnBook.disabled = over;

        return { val, over };
      }

      function computeTotal() {
        const people = parseInt(inputPeople.value || '1', 10) || 1;
        const total = toMoney(unit) * people;
        return { people, total };
      }

      function renderSummary() {
        const title = (qs('.experience-title', form)?.textContent || '').trim();
        const location = (qs('.experience-location', form)?.textContent || '').trim();
        const date = (dateInput?.value || '').trim();
        const { people, total } = computeTotal();

        // Hidden fields for checkout pipeline
        if (fTotal) fTotal.value = total.toString();

        if (summaryEl) {
          summaryEl.innerHTML = `
            <div><strong>${title}</strong></div>
            ${location ? `<div>${location}</div>` : ''}
            <div>People: ${people}${date ? ' · Date: ' + date : ''}</div>
            <div>Unit: ${currency} ${unit.toLocaleString()}</div>
            <div><strong>Total: ${currency} ${total.toLocaleString()}</strong></div>
          `;
        }
      }

      // Wire buttons
      qsa('.btn-step', peopleWrap).forEach(btn => {
        btn.addEventListener('click', () => {
          const step = parseInt((btn as HTMLElement).dataset.step || '0', 10);
          inputPeople.value = ((parseInt(inputPeople.value || '1', 10) || 1) + step).toString();
          clampAndValidate();
          renderSummary();
        });
      });

      // Inputs
      inputPeople.addEventListener('input', () => { 
        clampAndValidate(); 
        renderSummary(); 
      });
      
      if (dateInput) {
        dateInput.addEventListener('change', renderSummary);
      }

      // Submit guard
      form.addEventListener('submit', (e) => {
        const { over } = clampAndValidate();
        if (over) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          renderSummary();
        }
      });

      // Initial paint
      clampAndValidate();
      renderSummary();
    }

    // Initialize
    fixPartnerLinks();
    qsa('form#booking-form, form.booking-form, .experience-booking form').forEach(form => {
      initBookingForm(form as HTMLFormElement);
    });

    // Observe SPA updates
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.nodeType !== 1) return;
          const element = n as Element;
          
          // Fix partner links in new nodes
          fixPartnerLinks(element);
          
          // Init any new forms
          qsa('form#booking-form, form.booking-form, .experience-booking form', element).forEach(form => {
            initBookingForm(form as HTMLFormElement);
          });
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
    };
  }, []);
};