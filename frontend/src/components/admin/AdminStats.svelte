<script lang="ts">
  import type { Booking } from '../../lib/api/admin';

  export let bookings: Booking[];

  $: pending = bookings.filter((b) => b.status === 'pending').length;
  $: confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  $: cancelled = bookings.filter((b) => b.status === 'cancelled').length;
  $: total = bookings.length;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 bg-gray-50">
  <div class="bg-white p-5 md:p-6 rounded-xl shadow-md flex items-center gap-4 md:gap-5 hover:shadow-lg transition-shadow">
    <div class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold">P</div>
    <div>
      <h3 class="text-xs text-gray-600 uppercase tracking-wide mb-1">Pending</h3>
      <div class="text-2xl md:text-3xl font-bold text-gray-800">{pending}</div>
    </div>
  </div>
  <div class="bg-white p-5 md:p-6 rounded-xl shadow-md flex items-center gap-4 md:gap-5 hover:shadow-lg transition-shadow">
    <div class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold">C</div>
    <div>
      <h3 class="text-xs text-gray-600 uppercase tracking-wide mb-1">Confirmed</h3>
      <div class="text-2xl md:text-3xl font-bold text-gray-800">{confirmed}</div>
    </div>
  </div>
  <div class="bg-white p-5 md:p-6 rounded-xl shadow-md flex items-center gap-4 md:gap-5 hover:shadow-lg transition-shadow">
    <div class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold">X</div>
    <div>
      <h3 class="text-xs text-gray-600 uppercase tracking-wide mb-1">Cancelled</h3>
      <div class="text-2xl md:text-3xl font-bold text-gray-800">{cancelled}</div>
    </div>
  </div>
  <div class="bg-white p-5 md:p-6 rounded-xl shadow-md flex items-center gap-4 md:gap-5 hover:shadow-lg transition-shadow">
    <div class="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-cyan-500 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold">T</div>
    <div>
      <h3 class="text-xs text-gray-600 uppercase tracking-wide mb-1">Total</h3>
      <div class="text-2xl md:text-3xl font-bold text-gray-800">{total}</div>
    </div>
  </div>
</div>

