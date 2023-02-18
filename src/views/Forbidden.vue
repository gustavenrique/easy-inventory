<template>
    <div class="d-flex flex-column align-items-center justify-content-center p-5">
        <p>Você não possui acesso a esta página. Tente ir para a 
            <router-link to='/products'>principal</router-link>
        </p>

        <img src="../assets/error403.webp" class="image mx-auto">
    </div>    
</template>

<style>
.image {
    width: 100% !important;
}

@media (min-width: 600px) { .image { width: 75% !important; } }
@media (min-width: 900px) { .image { width: 50% !important; } }

</style>