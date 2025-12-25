<script lang="ts">
  import Nav from './Nav.svelte';
</script>

<header class="relative min-h-screen overflow-hidden">
  <!-- Background image with overlay -->
  <div class="absolute inset-0 z-0">
    <img 
      src="/static/photos/image 1.png" 
      alt="" 
      class="w-full h-full object-cover object-center"
      aria-hidden="true"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
  </div>
  
  <!-- Logo -->
  <div class="absolute top-4 left-4 md:top-6 md:left-8 lg:top-8 lg:left-16 xl:left-32 z-20">
    <div class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-sm">
      <img src="/static/photos/Frame 1.png" alt="Forest Home Logo" class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
    </div>
  </div>
  
  <Nav />
  
  <!-- Main content -->
  <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center text-gray-300">
    <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider drop-shadow-2xl mb-2 md:mb-4">
      <span class="text-accent">Л</span>есной
    </h1>
    <h2 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider drop-shadow-2xl">
      GLAMPING
    </h2>
  </div>
</header>
