<script lang="ts">
  export let statusFilter: string;
  export let dateFilter: string;
  export let searchText: string;
</script>

<div class="p-6 md:p-8 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="statusFilter" class="text-sm text-gray-600 font-semibold">Status</label>
    <select id="statusFilter" bind:value={statusFilter} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>
  
  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="dateFilter" class="text-sm text-gray-600 font-semibold">Date</label>
    <select id="dateFilter" bind:value={dateFilter} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
      <option value="">All dates</option>
      <option value="today">Today</option>
      <option value="tomorrow">Tomorrow</option>
      <option value="week">This week</option>
      <option value="month">This month</option>
      <option value="future">Future</option>
    </select>
  </div>

  <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
    <label for="searchInput" class="text-sm text-gray-600 font-semibold">Search</label>
    <input type="text" id="searchInput" bind:value={searchText} class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Name, phone, email..." />
  </div>
</div>

