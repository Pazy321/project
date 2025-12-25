import { writable, derived, get } from 'svelte/store';

// State
const adults = writable(2);
const children = writable(0);
const infants = writable(0);
const checkinDate = writable<Date | null>(null);
const checkoutDate = writable<Date | null>(null);

// Actions
function setAdults(value: number) {
  adults.set(Math.max(1, Math.min(6, value)));
}

function setChildren(value: number) {
  children.set(Math.max(0, Math.min(4, value)));
}

function setInfants(value: number) {
  infants.set(Math.max(0, Math.min(2, value)));
}

function setCheckinDate(date: Date | null) {
  checkinDate.set(date);
}

function setCheckoutDate(date: Date | null) {
  checkoutDate.set(date);
}

function reset() {
  adults.set(2);
  children.set(0);
  infants.set(0);
  checkinDate.set(null);
  checkoutDate.set(null);
}

// Derived values
const totalGuests = derived([adults, children], ([$adults, $children]) => $adults + $children);

const guestsText = derived(
  [adults, children, infants],
  ([$adults, $children, $infants]) => {
    const parts: string[] = [];
    if ($adults > 0) {
      const adultText = $adults === 1 ? 'взрослый' : $adults < 5 ? 'взрослых' : 'взрослых';
      parts.push(`${$adults} ${adultText}`);
    }
    if ($children > 0) {
      const childText = $children === 1 ? 'ребенок' : $children < 5 ? 'ребенка' : 'детей';
      parts.push(`${$children} ${childText}`);
    }
    if ($infants > 0) {
      const infantText = $infants === 1 ? 'младенец' : $infants < 5 ? 'младенца' : 'младенцев';
      parts.push(`${$infants} ${infantText}`);
    }
    return parts.length ? parts.join(', ') : 'Выберите гостей';
  }
);

// Export stores and actions
export const bookingStore = {
  // Stores (subscribable)
  adults,
  children,
  infants,
  checkinDate,
  checkoutDate,
  totalGuests,
  guestsText,
  
  // Actions
  setAdults,
  setChildren,
  setInfants,
  setCheckinDate,
  setCheckoutDate,
  reset,
  
  // Helper to get current values
  getState: () => ({
    adults: get(adults),
    children: get(children),
    infants: get(infants),
    checkinDate: get(checkinDate),
    checkoutDate: get(checkoutDate),
  }),
};
