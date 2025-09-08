// Booking form utilities and interactive functionality
export const initializeBookingForm = () => {
  const formatMoney = (n: number, currency: string) => `${currency} ${Number(n || 0).toLocaleString()}`;
  
  const clamp = (val: string | number, min = 1): number => {
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) || parsed < min ? min : parsed;
  };

  function initAvailabilityToBooking() {
    const form = document.getElementById('availability-form') as HTMLFormElement;
    if (!form) return;

    const max = Number(form.dataset.max || '0');
    const peopleInput = form.querySelector('input[name="people"]') as HTMLInputElement;
    const errorElement = form.querySelector('.people-error') as HTMLElement;

    // Live limit check for availability form
    ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
      peopleInput?.addEventListener(eventType, () => {
        const value = clamp(peopleInput.value);
        const isOverLimit = max > 0 && value > max;
        if (errorElement) {
          errorElement.hidden = !isOverLimit;
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateInput = form.querySelector('input[name="date"]') as HTMLInputElement;
      const date = dateInput?.value || '';
      const people = clamp(peopleInput?.value || '1');
      
      if (max > 0 && people > max) return;

      // Prefill booking form
      const bookingForm = document.getElementById('booking-form') as HTMLFormElement;
      if (bookingForm) {
        const bfPeople = bookingForm.querySelector('input[name="people"]') as HTMLInputElement;
        const bfDate = bookingForm.querySelector('input[name="date"]') as HTMLInputElement;
        
        if (bfPeople) bfPeople.value = String(people);
        if (bfDate) bfDate.value = date;

        // Make booking form visible if hidden in accordion/tab
        const nearestSection = bookingForm.closest('[hidden]') as HTMLElement;
        if (nearestSection) nearestSection.hidden = false;

        // Scroll and focus for mobile
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const firstInput = bfPeople || bfDate || bookingForm.querySelector('input');
          firstInput?.focus();
        }, 250);

        // Trigger review recompute
        computeAndRenderReview(bookingForm);
      }

      // Close modal
      const modal = form.closest('#availability-modal') as HTMLElement;
      if (modal) modal.hidden = true;
    });
  }

  function wirePeopleStepper(bookingForm: HTMLElement) {
    const wrapper = bookingForm.querySelector('.people-input') as HTMLElement;
    if (!wrapper) return;
    
    const input = wrapper.querySelector('input[type="number"]') as HTMLInputElement;
    const errorElement = bookingForm.querySelector('.people-error') as HTMLElement;
    const max = Number(wrapper.dataset.max || '0');

    function validate() {
      const value = clamp(input.value);
      input.value = String(value);
      const isOverLimit = max > 0 && value > max;
      if (errorElement) {
        errorElement.hidden = !isOverLimit;
      }
      return !isOverLimit;
    }

    // Wire up stepper buttons
    wrapper.querySelectorAll('.btn-step').forEach((btn) => {
      const button = btn as HTMLButtonElement;
      button.addEventListener('click', () => {
        const currentValue = parseInt(input.value || '1', 10) || 1;
        const step = parseInt(button.dataset.step || '0', 10);
        input.value = String(clamp(currentValue + step));
        validate();
        computeAndRenderReview(bookingForm);
      });
    });

    // Live validation
    ['input', 'change', 'blur', 'keyup'].forEach(eventType => {
      input.addEventListener(eventType, () => {
        validate();
        computeAndRenderReview(bookingForm);
      });
    });

    validate();
  }

  function computeAndRenderReview(bookingForm: HTMLElement) {
    const unitPrice = Number(bookingForm.dataset.unitPrice || '0');
    const currency = bookingForm.dataset.currency || 'KES';
    const peopleInput = bookingForm.querySelector('input[name="people"]') as HTMLInputElement;
    const people = clamp(peopleInput?.value || '1');

    const subtotal = unitPrice * people;
    const partnerAmount = Math.round(subtotal * 0.90);
    const platformAmount = subtotal - partnerAmount;
    const total = subtotal;

    // Update hidden fields
    const updateHiddenField = (id: string, value: string | number) => {
      const element = bookingForm.querySelector(id) as HTMLInputElement;
      if (element) element.value = String(value);
    };

    updateHiddenField('#bf-unit', unitPrice);
    updateHiddenField('#bf-curr', currency);
    updateHiddenField('#bf-total', total);
    updateHiddenField('#bf-partner', partnerAmount);
    updateHiddenField('#bf-platform', platformAmount);

    // Render price breakdown
    const reviewElement = document.getElementById('price-review');
    if (reviewElement) {
      reviewElement.innerHTML = `
        <div class="row"><span>Experience cost</span><span>${formatMoney(unitPrice, currency)}</span></div>
        <div class="row"><span>People</span><span>${people}</span></div>
        <div class="row"><span>Subtotal (cost × people)</span><span>${formatMoney(subtotal, currency)}</span></div>
        <div class="row"><span>Partner share (90%)</span><span>${formatMoney(partnerAmount, currency)}</span></div>
        <div class="row"><span>Platform & operations (10%)</span><span>${formatMoney(platformAmount, currency)}</span></div>
        <div class="row total"><span>Total</span><span>${formatMoney(total, currency)}</span></div>
        <div class="note">Your booking funds conservation impact: 90% goes directly to the partner.</div>
      `;
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAvailabilityToBooking();
    
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      wirePeopleStepper(bookingForm);
      computeAndRenderReview(bookingForm);
    }

    // Handle deep links with date/people parameters
    const params = new URLSearchParams(location.search || location.hash.split('?')[1] || '');
    const prePeople = params.get('people');
    const preDate = params.get('date');
    
    if ((prePeople || preDate) && bookingForm) {
      const peopleInput = bookingForm.querySelector('input[name="people"]') as HTMLInputElement;
      const dateInput = bookingForm.querySelector('input[name="date"]') as HTMLInputElement;
      
      if (prePeople && peopleInput) peopleInput.value = String(clamp(prePeople));
      if (preDate && dateInput) dateInput.value = preDate;
      
      computeAndRenderReview(bookingForm);
    }
  });
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  initializeBookingForm();
}