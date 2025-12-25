<script lang="ts">
  import Header from '../components/Header.svelte';
  import About from '../components/About.svelte';
  import Terrace from '../components/Terrace.svelte';
  import Gallery from '../components/Gallery.svelte';
  import Reviews from '../components/Reviews.svelte';
  import Rules from '../components/Rules.svelte';
  import BookingForm from '../components/BookingForm.svelte';
  import Footer from '../components/Footer.svelte';
</script>

<Header />
<main>
  <div class="global-bg-container">
    <About />
    <Terrace />
    <Gallery />
    <Reviews />
    <Rules />
    <BookingForm />
  </div>
</main>
<Footer />

<style>
  .global-bg-container {
    position: relative;
    background-image: url('/static/photos/image 5.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
  
  /* Smooth transition gradient at the top */
  .global-bg-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 320px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), transparent);
    z-index: 1;
    pointer-events: none;
  }
  
  @media (min-width: 768px) {
    .global-bg-container::after {
      height: 384px;
    }
  }
  
  @media (min-width: 1024px) {
    .global-bg-container::after {
      height: 448px;
    }
  }
  
  .global-bg-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 0;
  }
  
  .global-bg-container > :global(*) {
    position: relative;
    z-index: 1;
  }
</style>

