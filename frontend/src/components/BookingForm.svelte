<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';
  import { bookingStore } from '../lib/stores/booking';
  import { createBooking, type BookingInput } from '../lib/api/client';
  import { toasts } from 'svelte-toasts';
  import CalendarModal from './CalendarModal.svelte';
  import GuestsModal from './GuestsModal.svelte';

  // Subscribe to stores
  const { adults, children, infants, checkinDate, checkoutDate, guestsText, reset } = bookingStore;

  let showCalendar = false;
  let showGuests = false;
  let activeInput: 'checkin' | 'checkout' | null = null;
  let guestName = '';
  let guestEmail = '';
  let guestPhone = '';

  const basePrice = 6000;

  // Computed values
  $: nights = $checkinDate && $checkoutDate
    ? Math.ceil(($checkoutDate.getTime() - $checkinDate.getTime()) / (1000 * 60 * 60 * 24))
    : 2;

  $: extraGuests = Math.max(0, ($adults + $children) - 2);
  $: extraPrice = extraGuests * 1000 * nights;
  $: totalPrice = basePrice * nights + extraPrice;
  $: costDetail = `${basePrice} x ${nights} night${nights > 1 ? 's' : ''}${extraGuests > 0 ? ` + ${extraGuests} extra` : ''}`;

  $: checkinText = $checkinDate
    ? $checkinDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'short' })
    : '';

  $: checkoutText = $checkoutDate
    ? $checkoutDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'short' })
    : '';

  // Mutation
  const mutation = createMutation({
    mutationFn: (data: BookingInput) => createBooking(data),
    onSuccess: () => {
      showToast('Booking created successfully!', 'success');
      reset();
      guestName = '';
      guestEmail = '';
      guestPhone = '';
    },
    onError: (error: Error) => {
      showToast(error.message || 'Booking error', 'error');
    },
  });

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    toasts.add({
      title: message,
      type,
      duration: type === 'error' ? 5000 : 3000,
      theme: 'light',
    });
  }

  function openCalendar(input: 'checkin' | 'checkout') {
    activeInput = input;
    showCalendar = true;
  }

  function closeCalendar() {
    showCalendar = false;
    activeInput = null;
  }

  function openGuests() {
    showGuests = true;
  }

  function closeGuests() {
    showGuests = false;
  }

  function formatDateForDB(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (!$checkinDate || !$checkoutDate) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }

    if (!guestName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }

    if (!guestEmail.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail.trim())) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (!guestPhone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }

    const bookingData: BookingInput = {
      checkin_date: formatDateForDB($checkinDate),
      checkout_date: formatDateForDB($checkoutDate),
      adults: $adults,
      children: $children,
      infants: $infants,
      total_price: totalPrice,
      guest_name: guestName.trim(),
      guest_phone: guestPhone.trim(),
      guest_email: guestEmail.trim(),
    };

    $mutation.mutate(bookingData);
  }
</script>

<section id="booking" class="py-12 md:py-16 lg:py-20 bg-background-overlay flex justify-center items-center min-h-screen">
  <div class="container mx-auto px-4 md:px-6 lg:px-8">
    <h2 class="section-title">Booking</h2>
    
    <div class="flex justify-center">
      <div class="bg-gray-300 rounded-3xl p-6 md:p-8 lg:p-10 w-full max-w-3xl">
        <form on:submit={handleSubmit} class="flex flex-col gap-6 md:gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div class="flex flex-col">
              <label for="checkin" class="form-label">Check-in</label>
              <button
                type="button"
                class="date-input calendar-trigger relative cursor-pointer text-left"
                on:click={() => openCalendar('checkin')}
              >
                <input
                  type="text"
                  id="checkin"
                  class="form-input cursor-pointer"
                  placeholder="Select date"
                  readonly
                  value={checkinText}
                  tabindex="-1"
                />
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
            </div>
            
            <div class="flex flex-col">
              <label for="checkout" class="form-label">Check-out</label>
              <button
                type="button"
                class="date-input calendar-trigger relative cursor-pointer text-left"
                on:click={() => openCalendar('checkout')}
              >
                <input
                  type="text"
                  id="checkout"
                  class="form-input cursor-pointer"
                  placeholder="Select date"
                  readonly
                  value={checkoutText}
                  tabindex="-1"
                />
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
          
          <div class="flex flex-col">
            <label for="guests" class="form-label">Guests</label>
            <button
              type="button"
              class="guests-input relative cursor-pointer text-left"
              on:click={openGuests}
            >
              <input
                type="text"
                id="guests"
                class="form-input cursor-pointer"
                placeholder="2 adults"
                readonly
                value={$guestsText}
                tabindex="-1"
              />
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div class="flex flex-col">
              <label for="guestName" class="form-label">Full Name</label>
              <input
                type="text"
                id="guestName"
                class="form-input"
                placeholder="Enter your name"
                bind:value={guestName}
                required
              />
            </div>
            
            <div class="flex flex-col">
              <label for="guestEmail" class="form-label">Email</label>
              <input
                type="email"
                id="guestEmail"
                class="form-input"
                placeholder="example@mail.ru"
                bind:value={guestEmail}
                required
              />
            </div>
          </div>
          
          <div class="flex flex-col">
            <label for="phone" class="form-label">Phone</label>
            <input
              type="tel"
              id="phone"
              class="form-input"
              placeholder="+7(___)___ __ __"
              bind:value={guestPhone}
              required
            />
          </div>
          
          <div class="flex flex-col">
            <label class="form-label">Price</label>
            <div class="flex justify-between items-center bg-gray-50 rounded-lg p-4">
              <span class="text-gray-500 text-lg md:text-xl lg:text-2xl font-bold font-sans">{costDetail}</span>
              <span class="text-accent-dark text-2xl md:text-3xl lg:text-4xl font-bold font-sans">{totalPrice}₽</span>
            </div>
          </div>
          
          <button
            type="submit"
            class="bg-background-dark shadow-lg rounded-2xl border-none py-4 md:py-5 text-white text-2xl md:text-3xl lg:text-4xl font-bold font-sans tracking-wider cursor-pointer mt-4 hover:bg-background-darker transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={$mutation.isPending}
          >
            {$mutation.isPending ? 'Sending...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

{#if showCalendar && activeInput}
  <CalendarModal {activeInput} on:close={closeCalendar} />
{/if}

{#if showGuests}
  <GuestsModal on:close={closeGuests} />
{/if}
