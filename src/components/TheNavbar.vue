<script>
import { RouterLink } from 'vue-router'
import cookies from 'vue-cookies'

export default {
  name: 'navbar',
  data: () => ({
    toggleAtivo: false,
  }),
  computed: {
    userLoggedIn() { return cookies.get('username') }
  },
  methods: {
    trocarDesignToggle() {
        this.toggleAtivo = !this.toggleAtivo
    }
  }
}
</script>

<template>
    <div v-if='userLoggedIn' class="navbar navbar-expand-lg fixed-top p-3 bg-bg">
        <a href="https://stoquei.com" class="text-white" target="_blank" style="text-decoration: none">
          <h1><span class="display-5 font-weight-bold">St</span><i class="fas fa-pie-chart pie"></i><span class="display-5 font-weight-bold">quei</span></h1>
        </a>

        <button
          type="button"
          class="navbar-toggler"
          data-toggle="collapse"
          data-target="#nav-collapse"
          @click="trocarDesignToggle"
        >
          <div class="bg-light line1" :class="{ 'line1-ativa': toggleAtivo }"></div>
          <div class="bg-light line2" :class="{ 'line2-ativa': toggleAtivo }"></div>
          <div class="bg-light line3" :class="{ 'line3-ativa': toggleAtivo }"></div>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="nav-collapse">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <RouterLink class="m-1 nav-link navbar-link" to="/products">Produtos</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="m-1 nav-link navbar-link" to="/suppliers">Fornecedores</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="m-1 nav-link navbar-link" to="/orders">Pedidos</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="m-1 nav-link navbar-link" to="/users">Usuarios</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="m-1 nav-link navbar-link" to="/dashboard">Dashboard</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="m-1 nav-link navbar-link" to="/my-account">Sua Conta</RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
.router-link-active { border-bottom: 2px solid white !important; }

.full-rounded {
  border-radius: 50%;
}

.navbar { 
  padding: 1.5rem; 
  transition: all .1s;
}

.navbar-link {
  font-size: 1rem !important;
  color: #eee !important;
  letter-spacing: 1px !important;
  transition: all .4s !important;
  border-bottom: 2px solid #343a40;
}

.navbar-link:hover {
  border-bottom: 2px solid white;
}

/* toggle button */
.line1, .line2, .line3 {
  width: 23px;
  height: 3px;
  margin: 5px;
  transition: all .4s;
}

.line1-ativa {
  transform: rotate(-45deg) translate(-6px, 5px);
}

.line2-ativa { opacity: 0; }

.line3-ativa {
  transform: rotate(45deg) translate(-6px, -5px);
}
/* end of toggle button */

.pie{
  font-size: 1.5rem;
  position: relative;
  bottom: 3px;
}
</style>