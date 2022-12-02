<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/TheNavbar.vue'
import cookies from 'vue-cookies'
</script>

<template>
  <div class="d-flex flex-column">
    <section>
      <div class="wrapper bg-dark text-white d-block" style="width: 100vw !important;">
        <Navbar/>
      </div>
    </section>
    
    <RouterView :class="{view: cookies.get('username')}" class="min-vh-100" />
  </div>
</template>

<style scoped>
.view {
  margin-top: 6rem;
}
</style>
