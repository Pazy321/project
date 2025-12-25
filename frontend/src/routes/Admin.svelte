<script lang="ts">
  import { onMount } from 'svelte';
  import { getBookings, confirmBooking, cancelBooking, type Booking } from '../lib/api/admin';
  import { authStore } from '../lib/stores/auth';
  import { toasts } from 'svelte-toasts';
  import AdminLogin from '../components/admin/AdminLogin.svelte';
  import AdminHeader from '../components/admin/AdminHeader.svelte';
  import AdminStats from '../components/admin/AdminStats.svelte';
  import AdminFilters from '../components/admin/AdminFilters.svelte';
  import AdminTable from '../components/admin/AdminTable.svelte';
  import BookingDetailsModal from '../components/admin/BookingDetailsModal.svelte';

  const { user, isAuthenticated, isLoading: authLoading } = authStore;

  let statusFilter = '';
  let dateFilter = '';
  let searchText = '';
  let selectedBooking: Booking | null = null;
  let showDetailsModal = false;
  let currentPage = 1;
  const itemsPerPage = 10;

  // Local state for bookings (simpler than TanStack Query for this use case)
  let bookingsData: Booking[] = [];
  let bookingsLoading = true;
  let bookingsError: string | null = null;

  async function fetchBookings() {
    bookingsLoading = true;
    bookingsError = null;
    try {
      bookingsData = await getBookings();
    } catch (err) {
      bookingsError = err instanceof Error ? err.message : 'Failed to load bookings';
    } finally {
      bookingsLoading = false;
    }
  }

  // Check auth on mount and fetch bookings if authenticated
  onMount(async () => {
    const userData = await authStore.checkAuth();
    if (userData) {
      await fetchBookings();
    }
  });

  $: bookings = bookingsData;
  $: isLoading = bookingsLoading;

  // Action handlers for confirm/cancel
  async function doConfirmBooking(id: number) {
    try {
      await confirmBooking(id);
      await fetchBookings();
      showToast('Booking confirmed!', 'success');
      if (showDetailsModal) {
        showDetailsModal = false;
      }
    } catch (err) {
      showToast('Error confirming: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    }
  }

  async function doCancelBooking(id: number) {
    try {
      await cancelBooking(id);
      await fetchBookings();
      showToast('Booking cancelled!', 'success');
      if (showDetailsModal) {
        showDetailsModal = false;
      }
    } catch (err) {
      showToast('Error cancelling: ' + (err instanceof Error ? err.message : 'Unknown error'), 'error');
    }
  }

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    toasts.add({
      title: message,
      type,
      duration: type === 'error' ? 5000 : 3000,
      theme: 'light',
    });
  }

  // Filtering logic
  $: filteredBookings = bookings.filter((booking) => {
    if (statusFilter && booking.status !== statusFilter) return false;

    const checkinDate = new Date(booking.checkin_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter) {
      switch (dateFilter) {
        case 'today':
          if (checkinDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'tomorrow': {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (checkinDate.toDateString() !== tomorrow.toDateString()) return false;
          break;
        }
        case 'week': {
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          if (checkinDate < today || checkinDate > weekEnd) return false;
          break;
        }
        case 'month': {
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          if (checkinDate < today || checkinDate > monthEnd) return false;
          break;
        }
        case 'future':
          if (checkinDate < today) return false;
          break;
      }
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const matches =
        booking.guest_name?.toLowerCase().includes(searchLower) ||
        booking.guest_phone?.toLowerCase().includes(searchLower) ||
        booking.guest_email?.toLowerCase().includes(searchLower) ||
        booking.id.toString().includes(searchLower);
      if (!matches) return false;
    }

    return true;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  $: totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  $: pageBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers
  function handleViewBooking(booking: Booking) {
    selectedBooking = booking;
    showDetailsModal = true;
  }

  function handleConfirm(id: number) {
    doConfirmBooking(id);
  }

  function handleCancel(id: number) {
    doCancelBooking(id);
  }

  async function refreshBookings() {
    await fetchBookings();
    showToast('Data refreshed', 'success');
  }

  function exportToExcel() {
    showToast('Export in development', 'info');
  }

  async function handleLogout() {
    await authStore.logout();
    showToast('Logged out successfully', 'success');
  }

  function goToPage(page: number) {
    currentPage = page;
  }
</script>

<!-- Show loading while checking auth -->
{#if $authLoading}
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div class="text-center">
      <svg class="animate-spin w-12 h-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 font-medium">Checking authentication...</p>
    </div>
  </div>
{:else if !$isAuthenticated}
  <!-- Show login form if not authenticated -->
  <AdminLogin />
{:else}
  <!-- Show admin panel if authenticated -->
  <div class="font-sans bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-4 md:p-5">
    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <AdminHeader 
        {refreshBookings} 
        {exportToExcel}
        userName={$user?.name}
        onLogout={handleLogout}
      />
      <AdminStats {bookings} />
      <AdminFilters bind:statusFilter bind:dateFilter bind:searchText />
      <AdminTable
        {bookings}
        {pageBookings}
        {isLoading}
        {handleViewBooking}
        {handleConfirm}
        {handleCancel}
      />
      
      {#if totalPages > 1}
        <nav class="flex justify-center items-center gap-2 md:gap-3 mt-8 pt-6 border-t border-gray-200 p-4 md:p-6 lg:p-8" aria-label="Pagination">
          <button
            class="w-10 h-10 border border-gray-300 bg-white text-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            on:click={() => goToPage(currentPage - 1)}
            aria-label="Previous page"
          >
            &lt;
          </button>
          
          {#each Array(totalPages) as _, i}
            <button
              class="w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer transition-all {currentPage === i + 1
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary'}"
              on:click={() => goToPage(i + 1)}
              aria-label="Page {i + 1}"
              aria-current={currentPage === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          {/each}
          
          <button
            class="w-10 h-10 border border-gray-300 bg-white text-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            on:click={() => goToPage(currentPage + 1)}
            aria-label="Next page"
          >
            &gt;
          </button>
        </nav>
      {/if}
    </div>
  </div>

  {#if showDetailsModal && selectedBooking}
    <BookingDetailsModal
      booking={selectedBooking}
      on:close={() => (showDetailsModal = false)}
      on:confirm={() => handleConfirm(selectedBooking.id)}
      on:cancel={() => handleCancel(selectedBooking.id)}
    />
  {/if}
{/if}
