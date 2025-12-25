<script lang="ts">
  import { authStore } from '../../lib/stores/auth';
  import { toasts } from 'svelte-toasts';

  const { isLoading, error } = authStore;

  let email = '';
  let password = '';
  let showPassword = false;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!email.trim()) {
      toasts.add({ description: 'Пожалуйста, введите email', type: 'error', duration: 3000, theme: 'light' });
      return;
    }
    
    if (!password) {
      toasts.add({ description: 'Пожалуйста, введите пароль', type: 'error', duration: 3000, theme: 'light' });
      return;
    }

    const result = await authStore.login(email, password);
    
    if (result.success) {
      toasts.add({ description: 'Вход выполнен успешно', type: 'success', duration: 2000, theme: 'light' });
    } else {
      const errorMsg = result.error && result.error.trim() ? result.error : 'Ошибка входа';
      toasts.add({ description: errorMsg, type: 'error', duration: 4000, theme: 'light' });
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-darker flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Logo & Title -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">Lesnoj Glamping</h1>
      <p class="text-white/70">Панель администратора</p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-2xl shadow-2xl p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Вход</h2>
      
      <form on:submit={handleSubmit} class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input
              type="email"
              id="email"
              bind:value={email}
              on:keydown={handleKeydown}
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-800"
              placeholder="admin@example.com"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            {#if showPassword}
              <input
                type="text"
                id="password"
                bind:value={password}
                on:keydown={handleKeydown}
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-800"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            {:else}
              <input
                type="password"
                id="password"
                bind:value={password}
                on:keydown={handleKeydown}
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-800"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            {/if}
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              on:click={() => showPassword = !showPassword}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {#if showPassword}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              {:else}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Error message -->
        {#if $error}
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {$error}
          </div>
        {/if}

        <!-- Submit button -->
        <button
          type="submit"
          disabled={$isLoading}
          class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if $isLoading}
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Вход...
          {:else}
            Войти
          {/if}
        </button>
      </form>

      <!-- Back to home -->
      <div class="mt-6 text-center">
        <a href="/" class="text-sm text-gray-500 hover:text-primary transition-colors">
          ← Вернуться на сайт
        </a>
      </div>
    </div>
  </div>
</div>

