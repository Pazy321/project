<script lang="ts">
  import { onMount } from 'svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { ToastContainer, FlatToast } from 'svelte-toasts';
  
  import Home from './routes/Home.svelte';
  import Admin from './routes/Admin.svelte';
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
  
  let currentPath = '/';
  
  onMount(() => {
    currentPath = window.location.pathname;
    
    const handlePopState = () => {
      currentPath = window.location.pathname;
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });
  
  $: isAdmin = currentPath === '/admin';
</script>

<QueryClientProvider client={queryClient}>
  {#if isAdmin}
    <Admin />
  {:else}
    <Home />
  {/if}
</QueryClientProvider>

<ToastContainer placement="bottom-right" let:data>
  <FlatToast {data} />
</ToastContainer>
