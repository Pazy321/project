<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Booking } from '../../lib/api/admin';

  export let booking: Booking;

  const dispatch = createEventDispatcher();

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  }

  function formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
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
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
    };
    return statusMap[status] || status;
  }

  $: nights = Math.ceil(
    (new Date(booking.checkout_date).getTime() - new Date(booking.checkin_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  function close() {
    dispatch('close');
  }

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    dispatch('cancel');
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }
</script>

<div class="fixed inset-0 bg-black/70 z-[1000] flex justify-center items-center p-4 md:p-6" on:click={handleBackdropClick}>
  <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
    <div class="bg-gradient-to-r from-primary-dark to-primary text-white p-6 flex justify-between items-center rounded-t-2xl">
      <h2 class="text-xl md:text-2xl flex items-center gap-2">
        Booking Details <span>#{booking.id}</span>
      </h2>
      <button class="w-10 h-10 bg-transparent border-none text-white text-3xl cursor-pointer flex items-center justify-center rounded-full hover:bg-white/20 transition-colors" on:click={close}>×</button>
    </div>
    <div class="p-6 md:p-8">
      <div class="booking-details">
        <div class="detail-section mb-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Booking Info</h3>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">ID:</span>
            <span class="detail-value"><strong>#{booking.id}</strong></span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Created:</span>
            <span class="detail-value">{formatDateTime(booking.created_at)}</span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Status:</span>
            <span class="detail-value">
              <span class="status-badge {getStatusClass(booking.status)}">{getStatusText(booking.status)}</span>
            </span>
          </div>
        </div>
        
        <div class="detail-section mb-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Guest Info</h3>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Name:</span>
            <span class="detail-value">{booking.guest_name || 'Not specified'}</span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Phone:</span>
            <span class="detail-value">{booking.guest_phone || 'Not specified'}</span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Email:</span>
            <span class="detail-value">{booking.guest_email || 'Not specified'}</span>
          </div>
        </div>
        
        <div class="detail-section mb-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Stay Dates</h3>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Check-in:</span>
            <span class="detail-value"><strong>{formatDate(booking.checkin_date)}</strong></span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Check-out:</span>
            <span class="detail-value"><strong>{formatDate(booking.checkout_date)}</strong></span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Nights:</span>
            <span class="detail-value">{nights}</span>
          </div>
        </div>
        
        <div class="detail-section mb-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Guests</h3>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Adults:</span>
            <span class="detail-value">{booking.adults}</span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Children:</span>
            <span class="detail-value">{booking.children}</span>
          </div>
          <div class="detail-item flex justify-between py-2 border-b border-gray-200">
            <span class="detail-label text-gray-600">Infants:</span>
            <span class="detail-value">{booking.infants}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Price</h3>
          <div class="detail-item flex justify-between py-2">
            <span class="detail-label text-gray-600">Total:</span>
            <span class="detail-value"><strong>{formatPrice(booking.total_price)}</strong></span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 md:p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3 md:gap-4 border-t border-gray-200">
      <button class="btn-secondary" on:click={close}>Close</button>
      {#if booking.status === 'pending'}
        <button class="btn bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors" on:click={handleCancel}>Cancel</button>
        <button class="btn-primary" on:click={handleConfirm}>Confirm</button>
      {:else if booking.status === 'confirmed'}
        <button class="btn bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors" on:click={handleCancel}>Cancel</button>
      {/if}
    </div>
  </div>
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
</style>

