// Mobile booking flow utilities
export function initializeMobileBookingFlow() {
  const qs = (s: string, r: Document | Element = document) => r.querySelector(s);
  const clamp = (v: string | number) => { 
    const val = parseInt(v?.toString() || '1', 10); 
    return (isNaN(val) || val < 1) ? 1 : val; 
  };
  const fmtMoney = (n: number, cur: string) => `${cur} ${Number(n || 0).toLocaleString()}`;

  // People limit validation helper
  function validatePeople(container: Element) {
    const wrap = container.querySelector('.people-input') || container;
    const max = Number((wrap as HTMLElement)?.dataset.max || '0');
    const input = wrap.querySelector('input[type="number"]') as HTMLInputElement;
    const err = container.querySelector('.people-error') as HTMLElement;
    
    if (!input) return true;
    
    let val = clamp(input.value);
    input.value = val.toString();
    const over = (max > 0) && (val > max);
    
    if (err) err.hidden = !over;
    return !over;
  }

  // Price review computation
  function computeAndRenderReview(form: HTMLFormElement) {
    const unit = Number(form.dataset.unitPrice || '0');
    const cur = form.dataset.currency || 'KES';
    const ppl = clamp(form.querySelector<HTMLInputElement>('input[name="people"]')?.value || '1');
    
    const subtotal = unit * ppl;
    const partner = Math.round(subtotal * 0.90);
    const platform = subtotal - partner;
    
    const review = qs('#price-review', form) as HTMLElement;
    if (review) {
      review.innerHTML = `
        <div class="row"><span>Experience cost</span><span>${fmtMoney(unit, cur)}</span></div>
        <div class="row"><span>People</span><span>${ppl}</span></div>
        <div class="row"><span>Subtotal (cost × people)</span><span>${fmtMoney(subtotal, cur)}</span></div>
        <div class="row"><span>Partner (90%)</span><span>${fmtMoney(partner, cur)}</span></div>
        <div class="row"><span>Platform & operations (10%)</span><span>${fmtMoney(platform, cur)}</span></div>
        <div class="row total"><span>Total</span><span>${fmtMoney(subtotal, cur)}</span></div>
        <div class="note">90% of your booking funds the partner's conservation impact.</div>
      `;
    }
  }

  // Wire up people steppers
  function wirePeopleStepper() {
    const form = qs('#booking-form') as HTMLFormElement;
    if (!form) return;
    
    const wrap = form.querySelector('.people-input');
    const input = wrap?.querySelector('input[type="number"]') as HTMLInputElement;
    if (!wrap || !input) return;

    // Set mobile placeholder
    if (window.matchMedia('(max-width: 768px)').matches) {
      input.placeholder = '0';
    }

    // Update on stepper click
    wrap.querySelectorAll('.btn-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt((btn as HTMLElement).dataset.step || '0', 10);
        const currentVal = parseInt(input.value || '1', 10) || 1;
        input.value = clamp(currentVal + step).toString();
        validatePeople(form);
        computeAndRenderReview(form);
      });
    });

    // Update on manual input
    ['input', 'change', 'blur', 'keyup'].forEach(ev => {
      input.addEventListener(ev, () => { 
        validatePeople(form); 
        computeAndRenderReview(form); 
      });
    });

    // Initial validation and review
    validatePeople(form);
    computeAndRenderReview(form);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePeopleStepper);
  } else {
    wirePeopleStepper();
  }

  // Wire up related carousel controls
  function wireRelatedCarousel() {
    const root = qs('#related-experiences');
    if (!root) return;
    const track = root.querySelector('.track') as HTMLElement;
    const prev = root.querySelector('.nav .prev') as HTMLButtonElement;
    const next = root.querySelector('.nav .next') as HTMLButtonElement;
    if (!track || !prev || !next) return;

    function cardWidth() {
      const card = track.querySelector('.card') as HTMLElement;
      if (!card) return 320;
      const rect = card.getBoundingClientRect();
      return Math.ceil(rect.width + 16); // include gap
    }

    prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: cardWidth(), behavior: 'smooth' }));
  }

  // Handle deep linking with URL parameters
  const params = new URLSearchParams(location.search || location.hash.split('?')[1] || '');
  const prePeople = params.get('people');
  const preDate = params.get('date');
  
  if ((prePeople || preDate)) {
    const form = qs('#booking-form') as HTMLFormElement;
    if (form) {
      const peopleInput = form.querySelector('input[name="people"]') as HTMLInputElement;
      const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement;
      
      if (prePeople && peopleInput) peopleInput.value = clamp(prePeople).toString();
      if (preDate && dateInput) dateInput.value = preDate;
      
      computeAndRenderReview(form);
    }
  }

  // Initialize carousel controls
  wireRelatedCarousel();
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeMobileBookingFlow();
}