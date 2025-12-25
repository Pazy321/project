<script lang="ts">
  function scrollToSection(e: Event, id: string) {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }
  
  function scrollToBooking() {
    const element = document.getElementById('booking');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  }
</script>
<style>
  .nav-container {
    border: 1px solid #002802;
    box-shadow: inset 0 0 0 2px #002802;
    background-color: #072006d9;
  }
</style>

<nav class="absolute top-6 md:top-8 left-1/2 transform -translate-x-1/2 z-20 w-[95%] md:w-[90%] lg:w-[1261px]">
  <div class="nav-container rounded-2xl border border-gray-400 shadow-lg px-4 md:px-6 lg:px-10 py-3 md:py-4 flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-6">
    <a href="#about" on:click={(e) => scrollToSection(e, 'about')} class="text-white text-sm md:text-base lg:text-lg font-normal hover:text-accent-DEFAULT transition-colors">О нас</a>
    <a href="#gallery" on:click={(e) => scrollToSection(e, 'gallery')} class="text-white text-sm md:text-base lg:text-lg font-normal hover:text-accent-DEFAULT transition-colors">Галерея</a>
    <a href="#reviews" on:click={(e) => scrollToSection(e, 'reviews')} class="text-white text-sm md:text-base lg:text-lg font-normal hover:text-accent-DEFAULT transition-colors">Отзывы</a>
    <a href="#conditions" on:click={(e) => scrollToSection(e, 'conditions')} class="text-white text-sm md:text-base lg:text-lg font-normal hover:text-accent-DEFAULT transition-colors">Цены</a>
    <a href="#contacts" on:click={(e) => scrollToSection(e, 'contacts')} class="text-white text-sm md:text-base lg:text-lg font-normal hover:text-accent-DEFAULT transition-colors">Контакты</a>
    <button on:click={scrollToBooking} class="btn-primary text-sm md:text-base lg:text-lg px-4 md:px-5 lg:px-6 py-2 md:py-2.5">
      <span>Забронировать</span>
    </button>
  </div>
</nav>

