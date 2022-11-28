<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/TheNavbar.vue'
</script>

<template>
  <div class="d-flex flex-column">
    <section>
      <div class="wrapper p-3 bg-dark text-white d-block" style="width: 100vw !important;">
        <!-- <Navbar msg="You did it!" /> -->
  
        <nav class="d-block">
          <RouterLink class="text-white" to="/">Home</RouterLink>
          <span class="mx-3">|</span>
          <RouterLink  class="text-white" to="/about">About</RouterLink>
        </nav>
      </div>
    </section>
  
    <RouterView />
  </div>
</template>

<style scoped>

</style>
