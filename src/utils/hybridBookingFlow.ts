// Airbnb × GetYourGuide Hybrid Booking Flow
// Single source of truth for date and people captured once in Check availability step

export function initializeHybridBookingFlow() {
  const qs = (s: string, r: Document | Element = document) => r.querySelector(s);
  const clamp = (v: string | number) => { 
    const val = parseInt(v?.toString() || '1', 10); 
    return (isNaN(val) || val < 1) ? 1 : val; 
  };
  const money = (n: number, c: string) => `${c} ${Number(n || 0).toLocaleString()}`;

  // App state
  const Booking = { date: '', people: 1, max: 0, unit: 0, curr: 'KES' };

  // Elements
  const aCta = qs('#availability-cta') as HTMLElement;
  const aModal = qs('#availability-modal') as HTMLElement;
  const aForm = qs('#availability-form') as HTMLFormElement;
  const bWrap = qs('#booking-section') as HTMLElement;
  const bForm = qs('#booking-form') as HTMLFormElement;
  const stickyContinue = qs('#sticky-continue') as HTMLButtonElement;

  if (!aForm || !bForm) return;

  // Init config
  Booking.max = Number(aForm.dataset.max || '0');
  Booking.unit = Number(bForm.dataset.unitPrice || '0');
  Booking.curr = bForm.dataset.currency || 'KES';

  // Open/close availability
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.btn-check-availability')) { 
      e.preventDefault(); 
      openAvail(); 
    }
    if (target.closest('[data-close="availability"]')) { 
      e.preventDefault(); 
      closeAvail(); 
    }
  });

  function openAvail() { 
    if (aModal) {
      aModal.hidden = false; 
      const dateInput = qs('input[name="date"]', aForm) as HTMLInputElement;
      if (dateInput) dateInput.focus();
    }
  }
  
  function closeAvail() { 
    if (aModal) aModal.hidden = true; 
  }

  // Availability submit → lock chips + show booking
  aForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateInput = qs('input[name="date"]', aForm) as HTMLInputElement;
    const peopleInput = qs('input[name="people"]', aForm) as HTMLInputElement;
    const err = qs('.people-error', aForm) as HTMLElement;
    
    const date = dateInput?.value || '';
    let ppl = clamp(peopleInput?.value || '1');
    const over = (Booking.max > 0) && (ppl > Booking.max);
    
    if (err) err.hidden = !over;
    if (over) return;

    Booking.date = date;
    Booking.people = ppl;

    // Lock chips & hidden mirrors
    const dateLock = qs('[data-lock="date"]', bForm) as HTMLElement;
    const peopleLock = qs('[data-lock="people"]', bForm) as HTMLElement;
    
    if (dateLock) dateLock.textContent = date;
    if (peopleLock) peopleLock.textContent = String(ppl);
    
    const hiddenDate = qs('#bf-date', bForm) as HTMLInputElement;
    const hiddenPeople = qs('#bf-people', bForm) as HTMLInputElement;
    if (hiddenDate) hiddenDate.value = date;
    if (hiddenPeople) hiddenPeople.value = String(ppl);

    // Hide CTA, reveal booking
    if (aCta) aCta.classList.add('hidden');
    closeAvail();
    if (bWrap) bWrap.hidden = false;
    
    // Focus first editable field
    const first = bForm.querySelector('input[name="name"], input[name="email"]') as HTMLElement;
    if (bWrap && first) {
      bWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { if (first.focus) first.focus(); }, 200);
    }

    renderReview();
    updateStickyTotal();
  });

  // Allow "Change" to re-open availability with current values
  const editButton = qs('#edit-availability', bForm) as HTMLButtonElement;
  editButton?.addEventListener('click', () => {
    const ad = qs('input[name="date"]', aForm) as HTMLInputElement;
    const ap = qs('input[name="people"]', aForm) as HTMLInputElement;
    if (ad) ad.value = Booking.date;
    if (ap) ap.value = String(Booking.people);
    openAvail();
  });

  // Price review calculation
  function renderReview() {
    const subtotal = Booking.unit * Booking.people;
    const partner = Math.round(subtotal * 0.90);
    const platform = subtotal - partner;
    
    const hiddenUnit = qs('#bf-unit', bForm) as HTMLInputElement;
    const hiddenCurr = qs('#bf-curr', bForm) as HTMLInputElement;
    const hiddenTotal = qs('#bf-total', bForm) as HTMLInputElement;
    const hiddenPartner = qs('#bf-partner', bForm) as HTMLInputElement;
    const hiddenPlatform = qs('#bf-platform', bForm) as HTMLInputElement;
    
    if (hiddenUnit) hiddenUnit.value = String(Booking.unit);
    if (hiddenCurr) hiddenCurr.value = Booking.curr;
    if (hiddenTotal) hiddenTotal.value = String(subtotal);
    if (hiddenPartner) hiddenPartner.value = String(partner);
    if (hiddenPlatform) hiddenPlatform.value = String(platform);

    const box = qs('#price-review', bForm) as HTMLElement;
    if (box) {
      box.innerHTML = `
        <div class="row"><span>Experience cost</span><span>${money(Booking.unit, Booking.curr)}</span></div>
        <div class="row"><span>People</span><span>${Booking.people}</span></div>
        <div class="row"><span>Subtotal (cost × people)</span><span>${money(subtotal, Booking.curr)}</span></div>
        <div class="row"><span>Partner (90%)</span><span>${money(partner, Booking.curr)}</span></div>
        <div class="row"><span>Platform & operations (10%)</span><span>${money(platform, Booking.curr)}</span></div>
        <div class="row total"><span>Total</span><span>${money(subtotal, Booking.curr)}</span></div>
        <div class="note">90% of your booking funds the partner's conservation impact.</div>
      `;
    }
  }

  // Sticky bar total (mobile/tablet)
  function updateStickyTotal() {
    const el = qs('.sticky-total-value') as HTMLElement;
    if (!el) return;
    const subtotal = Booking.unit * Booking.people;
    el.textContent = money(subtotal, Booking.curr);
  }
  
  stickyContinue?.addEventListener('click', () => bForm.requestSubmit());

  // Submit booking
  bForm.addEventListener('submit', (e) => {
    console.log('Booking submitted with data:', {
      date: Booking.date,
      people: Booking.people,
      total: Booking.unit * Booking.people
    });
  });

  // ---- SPA support with MutationObserver ----
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Re-initialize if new booking elements are added
            if (element.querySelector('#availability-form, #booking-form') || 
                element.id === 'availability-form' || 
                element.id === 'booking-form') {
              setTimeout(() => initializeHybridBookingFlow(), 100);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
}

// Auto-initialize
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHybridBookingFlow);
  } else {
    initializeHybridBookingFlow();
  }
}
