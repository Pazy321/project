<script lang="ts">
  import { bookingStore } from '../lib/stores/booking';
  import { createEventDispatcher } from 'svelte';
  import { generateCalendarDays, formatCalendarDate, getMonthYearString } from '../lib/utils/calendar';

  export let activeInput: 'checkin' | 'checkout';

  const dispatch = createEventDispatcher<{ close: void }>();
  const { setCheckinDate, setCheckoutDate } = bookingStore;

  let currentMonth = new Date();
  let selectedDate: Date | null = null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Computed values
  $: year = currentMonth.getFullYear();
  $: month = currentMonth.getMonth();
  $: calendarDays = generateCalendarDays(year, month, selectedDate, today);
  $: monthYearText = getMonthYearString(currentMonth);
  $: selectedDateText = selectedDate ? formatCalendarDate(selectedDate) : '--';

  function selectDate(day: (typeof calendarDays)[0]) {
    if (!day.isPast && day.isCurrentMonth) {
      selectedDate = new Date(day.date);
    }
  }

  function getDayClasses(day: (typeof calendarDays)[0]): string {
    const base = 'px-3 py-2 md:py-3 text-center rounded-lg text-xs md:text-sm';
    
    if (!day.isCurrentMonth || day.isPast) {
      return `${base} cursor-not-allowed text-gray-400 bg-gray-100`;
    }
    
    if (day.isSelected) {
      return `${base} cursor-pointer transition-all bg-primary-dark text-white font-bold border-2 border-primary`;
    }
    
    if (day.isToday) {
      return `${base} cursor-pointer transition-all bg-primary text-white font-bold`;
    }
    
    return `${base} cursor-pointer transition-all border-2 border-transparent hover:bg-green-50 hover:border-primary`;
  }

  function prevMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  function confirm() {
    if (selectedDate && activeInput) {
      if (activeInput === 'checkin') {
        setCheckinDate(selectedDate);
      } else {
        setCheckoutDate(selectedDate);
      }
    }
    dispatch('close');
  }

  function cancel() {
    dispatch('close');
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      cancel();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      cancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="calendar-title"
  on:click={handleBackdropClick}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="bg-white rounded-2xl p-5 md:p-6 w-full max-w-sm md:max-w-md shadow-2xl"
    role="document"
    on:click|stopPropagation
  >
    <div class="flex justify-between items-center mb-4 px-2">
      <button
        class="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-full text-white border-none text-xl md:text-2xl cursor-pointer flex items-center justify-center hover:bg-primary-dark transition-colors"
        type="button"
        on:click={prevMonth}
        aria-label="Previous month"
      >
        ‹
      </button>
      <span id="calendar-title" class="text-base md:text-lg font-bold text-primary-dark min-w-[150px] text-center">
        {monthYearText}
      </span>
      <button
        class="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-full text-white border-none text-xl md:text-2xl cursor-pointer flex items-center justify-center hover:bg-primary-dark transition-colors"
        type="button"
        on:click={nextMonth}
        aria-label="Next month"
      >
        ›
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1 md:gap-2 mb-3 text-center font-bold text-primary-dark text-xs md:text-sm">
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
      <div>Sun</div>
    </div>
    
    <div class="grid grid-cols-7 gap-1 md:gap-2 mb-4 text-primary-darker" role="grid">
      {#each calendarDays as day (day.date.getTime())}
        <button
          type="button"
          class={getDayClasses(day)}
          disabled={day.isPast || !day.isCurrentMonth}
          on:click={() => selectDate(day)}
          aria-label={day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          aria-selected={day.isSelected}
        >
          {day.day}
        </button>
      {/each}
    </div>
    
    <div class="text-center mb-4 p-3 bg-gray-100 rounded-lg text-sm">
      <span class="text-gray-600">Selected: </span>
      <strong class="text-primary-dark font-bold">{selectedDateText}</strong>
    </div>
    
    <div class="flex gap-3">
      <button
        class="flex-1 py-3 border-none rounded-lg cursor-pointer font-bold text-sm md:text-base bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        type="button"
        on:click={cancel}
      >
        Cancel
      </button>
      <button
        class="flex-1 py-3 border-none rounded-lg cursor-pointer font-bold text-sm md:text-base bg-primary text-white hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={!selectedDate}
        on:click={confirm}
      >
        Select
      </button>
    </div>
  </div>
</div>
