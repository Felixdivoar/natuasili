// Airbnb × GetYourGuide Hybrid Booking Flow
// Single source of truth for date and people captured once in Check availability step

export function initializeHybridBookingFlow() {
  // ---- App state (single truth like Airbnb/GYG) ----
  const Booking = { date: '', people: 1, max: 0, unit: 0, curr: 'KES' };

  const qs = (s: string, r: Document | Element = document) => r.querySelector(s);
  const clamp = (v: string | number) => { 
    const val = parseInt(v?.toString() || '1', 10); 
    return (isNaN(val) || val < 1) ? 1 : val; 
  };
  const money = (n: number, c: string) => `${c} ${Number(n || 0).toLocaleString()}`;

  // ---- Elements ----
  const aCta = qs('#availability-cta') as HTMLElement;
  const aModal = qs('#availability-modal') as HTMLElement;
  const aForm = qs('#availability-form') as HTMLFormElement;
  const bSection = qs('#booking-section') as HTMLElement;
  const bForm = qs('#booking-form') as HTMLFormElement;
  
  if (!aForm || !bForm) return;

  // Init config
  Booking.max = Number(aForm.dataset.max || '0');
  Booking.unit = Number(bForm.dataset.unitPrice || '0');
  Booking.curr = bForm.dataset.currency || 'KES';

  // ---- Availability open/close ----
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

  // ---- Availability submit -> lock & prefill booking ----
  aForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const dateInput = qs('input[name="date"]', aForm) as HTMLInputElement;
    const peopleInput = qs('input[name="people"]', aForm) as HTMLInputElement;
    const err = qs('.people-error', aForm) as HTMLElement;
    
    const date = dateInput?.value || '';
    let people = clamp(peopleInput?.value || '1');
    const over = (Booking.max > 0) && (people > Booking.max);
    
    if (err) err.hidden = !over;
    if (over) return;

    // Save state
    Booking.date = date; 
    Booking.people = people;

    // Reflect & lock
    const dateLock = qs('[data-lock="date"]', bForm) as HTMLElement;
    const peopleLock = qs('[data-lock="people"]', bForm) as HTMLElement;
    
    if (dateLock) dateLock.textContent = date;
    if (peopleLock) peopleLock.textContent = String(people);
    
    // Hidden mirrors for backend
    const hiddenDate = qs('#bf-date', bForm) as HTMLInputElement;
    const hiddenPeople = qs('#bf-people', bForm) as HTMLInputElement;
    const hiddenUnit = qs('#bf-unit', bForm) as HTMLInputElement;
    const hiddenCurr = qs('#bf-curr', bForm) as HTMLInputElement;
    
    if (hiddenDate) hiddenDate.value = date;
    if (hiddenPeople) hiddenPeople.value = String(people);
    if (hiddenUnit) hiddenUnit.value = String(Booking.unit);
    if (hiddenCurr) hiddenCurr.value = Booking.curr;

    // Hide CTA, close modal, show booking (focus first editable field)
    if (aCta) aCta.classList.add('hidden');
    closeAvail();
    if (bSection) {
      bSection.hidden = false;
      bSection.classList.remove('hidden');
    }

    const firstField = bForm.querySelector('input[name="name"], input[name="email"]') as HTMLElement;
    if (bSection && firstField) {
      bSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        if (firstField.focus) firstField.focus();
      }, 200);
    }

    // Render price review
    renderReview();
  });

  // ---- Allow "Change" to reopen availability, keep state ----
  const editButton = qs('#edit-availability', bForm) as HTMLButtonElement;
  editButton?.addEventListener('click', () => {
    // Preload previous values back into availability
    const ad = qs('input[name="date"]', aForm) as HTMLInputElement;
    const ap = qs('input[name="people"]', aForm) as HTMLInputElement;
    
    if (ad) ad.value = Booking.date;
    if (ap) ap.value = String(Booking.people);
    openAvail();
  });

  // ---- Review math (unit × people + 90/10) ----
  function renderReview() {
    const subtotal = Booking.unit * Booking.people;
    const partner = Math.round(subtotal * 0.90);
    const platform = subtotal - partner;
    
    // Update hidden fields
    const hiddenTotal = qs('#bf-total', bForm) as HTMLInputElement;
    const hiddenPartner = qs('#bf-partner', bForm) as HTMLInputElement;
    const hiddenPlatform = qs('#bf-platform', bForm) as HTMLInputElement;
    
    if (hiddenTotal) hiddenTotal.value = String(subtotal);
    if (hiddenPartner) hiddenPartner.value = String(partner);
    if (hiddenPlatform) hiddenPlatform.value = String(platform);

    const box = qs('#price-review', bForm) as HTMLElement;
    if (!box) return;
    
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

  // ---- Submit booking (keep your existing backend/payment handoff) ----
  bForm.addEventListener('submit', (e) => {
    // Validate traveler details here as needed, then go to payment
    // Keep your current payment integration; we're only fixing flow/state.
    console.log('Booking submitted with data:', {
      date: Booking.date,
      people: Booking.people,
      total: Booking.unit * Booking.people
    });
  });

  // ---- Mobile nicety: people placeholder "0" on small screens ----
  if (window.matchMedia('(max-width:768px)').matches) {
    const ap = qs('input[name="people"]', aForm) as HTMLInputElement;
    if (ap && !ap.placeholder) ap.placeholder = '0';
  }

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
