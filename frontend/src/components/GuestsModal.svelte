<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { bookingStore } from '../lib/stores/booking';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ close: void }>();
  const { adults, children, infants, setAdults, setChildren, setInfants } = bookingStore;

  let tempAdults = get(adults);
  let tempChildren = get(children);
  let tempInfants = get(infants);

  $: total = tempAdults + tempChildren;

  function increment(type: 'adults' | 'children' | 'infants') {
    if (type === 'adults' && tempAdults < 6) tempAdults++;
    else if (type === 'children' && tempChildren < 4) tempChildren++;
    else if (type === 'infants' && tempInfants < 2) tempInfants++;
  }

  function decrement(type: 'adults' | 'children' | 'infants') {
    if (type === 'adults' && tempAdults > 1) tempAdults--;
    else if (type === 'children' && tempChildren > 0) tempChildren--;
    else if (type === 'infants' && tempInfants > 0) tempInfants--;
  }

  function confirm() {
    setAdults(tempAdults);
    setChildren(tempChildren);
    setInfants(tempInfants);
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

  onMount(() => {
    tempAdults = get(adults);
    tempChildren = get(children);
    tempInfants = get(infants);
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="guests-title"
  on:click={handleBackdropClick}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md md:max-w-lg shadow-2xl"
    role="document"
    on:click|stopPropagation
  >
    <div class="mb-5">
      <h3 id="guests-title" class="text-primary-dark text-center text-lg md:text-xl font-bold m-0">
        Выберите количество гостей
      </h3>
    </div>
    
    <div class="mb-5 space-y-4">
      <!-- Adults -->
      <div class="flex justify-between items-center py-4 border-b border-gray-200">
        <div class="flex flex-col">
          <span class="font-bold text-primary-dark mb-1 text-base md:text-lg">Взрослые</span>
          <span class="text-xs md:text-sm text-gray-600">14+ лет</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempAdults <= 1}
            on:click={() => decrement('adults')}
            aria-label="Уменьшить количество взрослых"
          >
            −
          </button>
          <span class="text-lg md:text-xl font-bold min-w-[30px] text-center text-primary-dark">
            {tempAdults}
          </span>
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempAdults >= 6}
            on:click={() => increment('adults')}
            aria-label="Увеличить количество взрослых"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Children -->
      <div class="flex justify-between items-center py-4 border-b border-gray-200">
        <div class="flex flex-col">
          <span class="font-bold text-primary-dark mb-1 text-base md:text-lg">Дети</span>
          <span class="text-xs md:text-sm text-gray-600">2-13 лет</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempChildren <= 0}
            on:click={() => decrement('children')}
            aria-label="Уменьшить количество детей"
          >
            −
          </button>
          <span class="text-lg md:text-xl font-bold min-w-[30px] text-center text-primary-dark">
            {tempChildren}
          </span>
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempChildren >= 4}
            on:click={() => increment('children')}
            aria-label="Увеличить количество детей"
          >
            +
          </button>
        </div>
      </div>
      
      <!-- Infants -->
      <div class="flex justify-between items-center py-4">
        <div class="flex flex-col">
          <span class="font-bold text-primary-dark mb-1 text-base md:text-lg">Младенцы</span>
          <span class="text-xs md:text-sm text-gray-600">0-2 года</span>
        </div>
        <div class="flex items-center gap-4">
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempInfants <= 0}
            on:click={() => decrement('infants')}
            aria-label="Уменьшить количество младенцев"
          >
            −
          </button>
          <span class="text-lg md:text-xl font-bold min-w-[30px] text-center text-primary-dark">
            {tempInfants}
          </span>
          <button
            class="w-11 h-11 border-2 border-primary bg-white text-primary rounded-full text-lg font-bold cursor-pointer flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tempInfants >= 2}
            on:click={() => increment('infants')}
            aria-label="Увеличить количество младенцев"
          >
            +
          </button>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-100 p-4 rounded-lg mb-5">
      <div class="flex justify-between mb-2 text-base md:text-lg text-primary-darker">
        <strong>Всего гостей:</strong>
        <span>{total}</span>
      </div>
      <div class="text-xs md:text-sm text-gray-600 text-center">
        <small>Доплата за дополнительного гостя: 1000₽/ночь</small>
      </div>
    </div>
    
    <div class="flex gap-3">
      <button
        class="flex-1 py-3 border-none rounded-lg cursor-pointer font-bold text-sm md:text-base bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        type="button"
        on:click={cancel}
      >
        Отмена
      </button>
      <button
        class="flex-1 py-3 border-none rounded-lg cursor-pointer font-bold text-sm md:text-base bg-primary text-white hover:bg-primary-dark transition-colors"
        type="button"
        on:click={confirm}
      >
        Применить
      </button>
    </div>
  </div>
</div>
