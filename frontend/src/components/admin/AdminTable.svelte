<script lang="ts">
  import type { Booking } from '../../lib/api/admin';

  export let bookings: Booking[];
  export let pageBookings: Booking[];
  export let isLoading: boolean;
  export let handleViewBooking: (booking: Booking) => void;
  export let handleConfirm: (id: number) => void;
  export let handleCancel: (id: number) => void;

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  }

  function formatPrice(price: number): string {
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);
    } catch (e) {
      return price + ' RUB';
    }
  }

  function getStatusClass(status: string): string {
    return `status-${status}`;
  }

  function getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'Ожидает',
      confirmed: 'Подтверждено',
      cancelled: 'Отменено',
    };
    return statusMap[status] || status;
  }
</script>

<div class="p-4 md:p-6 lg:p-8 overflow-x-auto">
  {#if isLoading}
    <div class="text-center py-10 text-gray-600 text-base md:text-lg">
      <div class="inline-block w-10 h-10 md:w-12 md:h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
      <p>Загрузка бронирований...</p>
    </div>
  {:else if pageBookings.length === 0}
    <div class="text-center py-10 text-gray-600 text-base md:text-lg">Бронирования не найдены</div>
  {:else}
    <table class="w-full border-collapse mt-5 text-sm md:text-base">
      <thead>
        <tr>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">ID</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Создано</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Гость</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Телефон</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Даты</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Гости</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Цена</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Статус</th>
          <th class="bg-gray-50 px-4 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky top-0">Действия</th>
        </tr>
      </thead>
      <tbody>
        {#each pageBookings as booking (booking.id)}
          <tr class="text-black">
            <td class="px-4 py-4 border-b border-gray-200"><strong>#{booking.id}</strong></td>
            <td class="px-4 py-4 border-b border-gray-200">{formatDate(booking.created_at)}</td>
            <td class="px-4 py-4 border-b border-gray-200">{booking.guest_name || 'Не указано'}</td>
            <td class="px-4 py-4 border-b border-gray-200">{booking.guest_phone || 'Не указано'}</td>
            <td class="px-4 py-4 border-b border-gray-200">
              <strong>{formatDate(booking.checkin_date)}</strong><br />
              <small>до {formatDate(booking.checkout_date)}</small>
            </td>
            <td class="px-4 py-4 border-b border-gray-200">
              {booking.adults} {booking.adults === 1 ? 'взрослый' : 'взрослых'}{booking.children > 0 ? `, ${booking.children} ${booking.children === 1 ? 'ребенок' : booking.children < 5 ? 'ребенка' : 'детей'}` : ''}
            </td>
            <td class="px-4 py-4 border-b border-gray-200"><strong>{formatPrice(booking.total_price)}</strong></td>
            <td class="px-4 py-4 border-b border-gray-200">
              <span class="status-badge {getStatusClass(booking.status)}">{getStatusText(booking.status)}</span>
            </td>
            <td class="px-4 py-4 border-b border-gray-200">
              <div class="booking-actions">
                <button class="action-btn btn-view" on:click={() => handleViewBooking(booking)} title="Просмотр">П</button>
                {#if booking.status === 'pending'}
                  <button class="action-btn btn-confirm" on:click={() => handleConfirm(booking.id)} title="Подтвердить">П</button>
                  <button class="action-btn btn-cancel" on:click={() => handleCancel(booking.id)} title="Отменить">О</button>
                {:else if booking.status === 'confirmed'}
                  <button class="action-btn btn-cancel" on:click={() => handleCancel(booking.id)} title="Отменить">О</button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .status-badge {
    @apply px-3 py-1 rounded-full text-xs font-semibold;
  }
  .status-pending {
    @apply bg-yellow-100 text-yellow-800;
  }
  .status-confirmed {
    @apply bg-green-100 text-green-800;
  }
  .status-cancelled {
    @apply bg-red-100 text-red-800;
  }
  .action-btn {
    @apply w-8 h-8 rounded-lg border-none cursor-pointer text-white font-bold text-sm mr-1 transition-colors;
  }
  .btn-view {
    @apply bg-blue-500 hover:bg-blue-600;
  }
  .btn-confirm {
    @apply bg-green-500 hover:bg-green-600;
  }
  .btn-cancel {
    @apply bg-red-500 hover:bg-red-600;
  }
</style>

