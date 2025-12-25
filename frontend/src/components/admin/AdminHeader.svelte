<script lang="ts">
  export let refreshBookings: () => void;
  export let exportToExcel: () => void;
  export let userName: string | undefined = undefined;
  export let onLogout: (() => void) | undefined = undefined;
</script>

<div class="bg-gradient-to-r from-primary-dark to-primary text-white p-4 md:p-6 lg:p-8">
  <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
    <!-- Title -->
    <h1 class="text-lg md:text-xl lg:text-2xl flex items-center gap-3">
      <span class="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center text-primary-dark font-bold text-lg md:text-xl shrink-0">
        FG
      </span>
      <span class="text-center lg:text-left">Управление бронированиями</span>
    </h1>
    
    <!-- Actions and User Info -->
    <div class="flex flex-wrap items-center justify-center gap-3 md:gap-4">
      <!-- Action buttons -->
      <div class="flex gap-2 md:gap-3">
        <button 
          class="px-3 py-2 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm md:text-base font-medium transition-colors flex items-center gap-2"
          on:click={refreshBookings}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">Обновить</span>
        </button>
        <button 
          class="px-3 py-2 md:px-4 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm md:text-base font-medium transition-colors flex items-center gap-2"
          on:click={exportToExcel}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="hidden sm:inline">Экспорт</span>
        </button>
      </div>
      
      <!-- User info and logout -->
      {#if userName || onLogout}
        <div class="flex items-center gap-3 pl-3 border-l border-white/30">
          {#if userName}
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="text-sm font-medium hidden md:block">{userName}</span>
            </div>
          {/if}
          
          {#if onLogout}
            <button
              class="px-3 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              on:click={onLogout}
              aria-label="Выход"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Выход</span>
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>
