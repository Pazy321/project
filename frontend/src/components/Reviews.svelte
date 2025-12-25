<script lang="ts">
  let reviewsContainer: HTMLDivElement;

  const reviewWidth = 564;

  function scrollNext() {
    if (reviewsContainer) {
      reviewsContainer.scrollBy({ left: reviewWidth, behavior: 'smooth' });
    }
  }

  function scrollPrev() {
    if (reviewsContainer) {
      reviewsContainer.scrollBy({ left: -reviewWidth, behavior: 'smooth' });
    }
  }
</script>

<section id="reviews" class="relative py-12 md:py-16 lg:py-20 min-h-[600px] md:min-h-[700px]">
  <div class="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
    <p class="text-xl md:text-2xl lg:text-3xl font-extrabold text-center text-white mb-4">Реальные отзывы наших гостей</p>
    <h2 class="section-title">Мы всегда рады видеть вас</h2>
    
    <div class="flex items-center justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
      <button
        on:click={scrollPrev}
        class="slider-arrow-prev w-12 h-12 md:w-16 md:h-16 bg-primary-dark rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
        aria-label="Предыдущий отзыв"
      >
        <svg class="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      
      <div
        bind:this={reviewsContainer}
        class="flex gap-4 md:gap-6 lg:gap-10 overflow-x-auto pb-4 scrollbar-hide flex-1"
        role="region"
        aria-label="Reviews carousel"
      >
        <!-- Review 1: Maxim -->
        <article class="bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 min-w-[280px] md:min-w-[400px] lg:min-w-[524px] text-black">
          <div class="flex items-center mb-5">
            <img src="/static/photos/Max.jpg" alt="" class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4 md:mr-5" />
            <h3 class="text-accent-dark text-2xl md:text-3xl lg:text-4xl font-bold font-sans">Maxim</h3>
          </div>
          <p class="text-sm md:text-base font-bold font-sans mb-5 leading-relaxed">
            Всё было отлично! Потрясающий отдых, рекомендую всем! Хозяева замечательные, дом продуман до мелочей! Уютно, пахнет деревом, всё необходимое для комфортного проживания!
          </p>
          <div class="flex gap-4 md:gap-5">
            <img src="/static/photos/image.jpg" alt="Review photo 1" class="w-24 h-14 md:w-32 md:h-18 rounded-lg object-cover" />
            <img src="/static/photos/Rectangle 25.jpg" alt="Review photo 2" class="w-24 h-14 md:w-32 md:h-18 rounded-lg object-cover" />
            <img src="/static/photos/image-1.jpg" alt="Review photo 3" class="w-24 h-14 md:w-32 md:h-18 rounded-lg object-cover" />
          </div>
        </article>
        
        <!-- Review 2: Alina -->
        <article class="bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 min-w-[280px] md:min-w-[400px] lg:min-w-[524px] text-black">
          <div class="flex items-center mb-5">
            <img src="/static/photos/Alina.jpg" alt="" class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4 md:mr-5" />
            <h3 class="text-accent-dark text-2xl md:text-3xl lg:text-4xl font-bold font-sans">Alina</h3>
          </div>
          <p class="text-sm md:text-base font-bold font-sans mb-5 leading-relaxed">
            Очень уютный теплый дом, много красивых мест поблизости в пешей доступности, всё очень понравилось. Рекомендую, приедем еще раз!
          </p>
          <div class="flex gap-4 md:gap-5">
            <img src="/static/photos/image otziv.jpg" alt="Review photo" class="w-24 h-14 md:w-32 md:h-18 rounded-lg object-cover" />
          </div>
        </article>
        
        <!-- Review 3: Vladislav -->
        <article class="bg-gradient-to-b from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 min-w-[280px] md:min-w-[400px] lg:min-w-[524px] text-black">
          <div class="flex items-center mb-5">
            <img src="/static/photos/image-2.jpg" alt="" class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full mr-4 md:mr-5" />
            <h3 class="text-accent-dark text-2xl md:text-3xl lg:text-4xl font-bold font-sans">Vladislav</h3>
          </div>
          <p class="text-sm md:text-base font-bold font-sans mb-5 leading-relaxed">
            Отдыхали с женой на майские праздники. Всё прошло отлично, очень понравилось. Отдельное спасибо хозяевам, отдельный шикарный дом. Дружелюбные, готовы помочь с любыми вопросами.
          </p>
        </article>
      </div>
      
      <button
        on:click={scrollNext}
        class="slider-arrow-next w-12 h-12 md:w-16 md:h-16 bg-primary-dark rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
        aria-label="Следующий отзыв"
      >
        <svg class="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</section>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
