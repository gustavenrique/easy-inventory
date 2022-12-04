<script>
import axios, * as others from 'axios';

$(() => $('[data-toggle="tooltip"]').tooltip())

export default {
    name: 'products',
    data: () => ({
        carregando: false,
        produtos: [],
        categorias: [],
        filtro: { categoria: null, produto: '' },
    }),
    mounted() {
        this.BuscarProdutos()
    },
    computed: {
        produtosFiltrados() {
            var produtoNome = this.filtro.produto.toLowerCase()
            var categoriaId = this.filtro.categoria?.id
            
            return !categoriaId && !produtoNome ? this.produtos
                : produtoNome && !categoriaId ? this.produtos.filter(p => p.nome.toLowerCase().includes(produtoNome))
                : categoriaId && !produtoNome ? this.produtos.filter(p => p.categoriaId === categoriaId)
                : this.produtos.filter(p => (p.categoriaId === categoriaId) && p.nome.toLowerCase().includes(produtoNome))
        }
    },
    methods: {
        BuscarProdutos() {
            axios.get(`${this.$apiUrl}/Produto/`)
                .then(response => {
                    this.carregando = true
                    
                    if (response.data && response.data.statusCode == 200)
                    {
                        this.produtos = response.data.object.produtos
                        this.categorias = response.data.object.categorias
                    }
                }).catch(error => {
                    if (error.response.data)
                        this.mensagem.texto = error.response.data.message
                    else 
                        this.mensagem.texto = "Ocorreu um erro ao fazer login! Tente novamente mais tarde."

                    this.mensagem.cor = "danger"
                })
                .finally(
                    this.carregando = false
                )
        },
        categoriaDoProduto(categoriaId) { 
            var categoria = this.categorias.find(c => c.id == categoriaId)
            return categoria.nome
        }
    }
}
</script>

<template>
    <section class="bg-white-dark">
        <div id='accordion' class="container p-3 pt-5">
            <div v-if='(produtos.length <= 0)' class="text-white text-center bg-dark p-3 mb-3 rounded">
                <p v-if='!carregando' class="h4">
                    Não há produtos registrados
                </p>
                <i v-else class="fa fa-spinner fa-pulse fa-3x"></i>
            </div>
            <div class="mb-3">
                <div class="d-flex flex-column flex-md-row">
                    <input v-model="filtro.produto" type="text" class="form-control mr-md-5 mb-3" placeholder="Filtre por nome">

                    <Multiselect
                        v-model="filtro.categoria"
                        :options="categorias" 
                        label="nome" 
                        track-by="id"
                        selectedLabel="Selecionado"
                        placeholder="Filtre por categoria">
                    </Multiselect>
                </div>

                <div class="pt-3 d-flex justify-content-end">
                    <button class="btn bg-bg-light text-white hover-button mr-3">
                        Escanear <i class="fas fa-barcode"></i>
                    </button>
                    <button class="btn bg-bg text-white hover-button"><i class="fa fa-plus"></i> Produto</button>
                    <button class="btn bg-bg text-white hover-button ml-3"><i class="fa fa-plus"></i> Fornecedor</button>
                </div>
            </div>
            <div v-if="produtos.length">
                <div class="card bg-bg-dark text-white">
                    <div class="row p-3">
                        <div class="col-md-6 col-4 pl-4">Nome</div>
                        <div class="col-md-3 col-4">Preço (R$)</div>
                        <div class="col-md-3 col-4">Quantidade</div>
                    </div>
                </div>
                <div v-for="produto in (produtosFiltrados || produtos)" :key="produto.id" class="card shadow">
                    <div class="card-header p-0">
                        <button class="btn d-flex py-3 bg-bg btn-block text-left text-white"
                         data-toggle="collapse"
                         :data-target="`#collapse-${produto.id}`">
                            <div class="col-md-6 col-5 ellipsis">{{ produto.nome}}</div>
                            <div class="col-md-3 col-3">{{ produto.preco }}</div>
                            <div class="col-md-3 col-4 d-flex">
                                <p class="mr-3">{{ produto.quantidade }}</p>

                                <div class="ml-auto">
                                    <i class="fa fa-trash hover-button p-2"></i>|
                                    <i class="fa fa-pen hover-button p-2"></i>
                                </div>
                            </div>
                        </button>
        
                        <div class="collapse" :id="`collapse-${produto.id}`" data-parent="#accordion">
                            <div class="card-body d-flex bg-bg-light text-white">
                                <div class="col-md-6 col-4" data-toggle="tooltip" title="Categoria" data-placement="bottom">{{ categoriaDoProduto(produto.categoriaId) }}</div>
                                <div class="col-md-3 col-4" data-toggle="tooltip" title="Fabricante" data-placement="bottom">{{ produto.fabricante }}</div>
                                <div class="col-md-3 col-4" data-toggle="tooltip" title="Código EAN" data-placement="bottom">{{ produto.codigoEan }}</div>
                            </div>
                        </div>
                    </div>
                </div>        
            </div>
        </div>
    </section>
</template>

<style>
* {
    transition: max-width .3s;
}

.btn:focus, .bnt:active, .form-control:active, .form-control:focus {
    box-shadow: none !important;
    outline: none !important;
    border: 0 !important;
}

.hover-button:hover {
    opacity: .7;
}

.multiselect__single {
    font-size: 1rem !important;
    margin-top: 1px !important;
}

.multiselect__tags {
    height: calc(2.25rem + 2px) !important;
    font-size: 1rem !important;
    line-height: 50% !important;
    border: 1px solid #ccc !important;
    border-radius: 5px !important;
    padding: 0.375rem 0.75rem !important;
}

.multiselect__input {
    min-height: 20px !important;
    font-size: 16px !important;
    line-height: 1.428571429 !important;
}

.multiselect__placeholder {
    padding-top: 8px !important;
    color: #495057 !important;
}

.multiselect__option--highlight {
    outline: none !important;
    color: #fff !important;
}

.multiselect__spinner:after,
.multiselect__spinner:before {
    border-top-color: #8a8a8a !important;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>