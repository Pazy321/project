<script lang="ts">
  export let statusFilter: string;
  export let dateFilter: string;
  export let searchText: string;
</script>

<div class="p-6 md:p-8 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="statusFilter" class="text-sm text-gray-600 font-semibold">Статус</label>
    <select id="statusFilter" bind:value={statusFilter} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
      <option value="">Все</option>
      <option value="pending">Ожидает</option>
      <option value="confirmed">Подтверждено</option>
      <option value="cancelled">Отменено</option>
    </select>
  </div>
  
  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="dateFilter" class="text-sm text-gray-600 font-semibold">Дата</label>
    <select id="dateFilter" bind:value={dateFilter} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
      <option value="">Все даты</option>
      <option value="today">Сегодня</option>
      <option value="tomorrow">Завтра</option>
      <option value="week">Эта неделя</option>
      <option value="month">Этот месяц</option>
      <option value="future">Будущие</option>
    </select>
  </div>

  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="searchInput" class="text-sm text-gray-600 font-semibold">Поиск</label>
    <input type="text" id="searchInput" bind:value={searchText} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Имя, телефон, email..." />
  </div>
</div>

