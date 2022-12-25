<script>
import axios, * as others from 'axios';
import ProdutoModal from '../components/ProdutoModal.vue'
import ScannerModal from '../components/ScannerModal.vue'

$(() => $('[data-toggle="tooltip"]').tooltip())

export default {
    name: 'products',
    components: { ProdutoModal, ScannerModal },
    data: () => ({
        carregando: false,
        produtos: [],
        categorias: [],
        fornecedores: [],
        filtro: { categoria: null, produto: '' },
        modalProduto: {
            modo: '', // Criar, Editar, Visualizar
            formulario: { nome: '', codigoEan: '', preco: null, fabricante: '', fornecedores: [], categoria: '', quantia: null },
            formularioOriginal: null
        },
        botoesProduto: {
            mostrar: false,
            produtoId: null
        },
        windowWidth: window.innerWidth,
        scanner: { active: false }
    }),
    mounted() {
        this.BuscarProdutos()

        window.addEventListener('resize', this.windowResize)
    },
    destroyed() {
        window.removeEventListener('resize', this.windowResize)
    },
    computed: {
        produtosFiltrados() {
            let produtoNome = this.filtro.produto.toLowerCase()
            let categoriaId = this.filtro.categoria?.id

            return !categoriaId && !produtoNome ? this.produtos
                : produtoNome && !categoriaId ? this.produtos.filter(p => p.nome.toLowerCase().includes(produtoNome))
                : categoriaId && !produtoNome ? this.produtos.filter(p => p.categoriaId === categoriaId)
                : this.produtos.filter(p => (p.categoriaId === categoriaId) && p.nome.toLowerCase().includes(produtoNome))
        }
    },
    methods: {
        BuscarProdutos() {
            this.carregando = true

            axios.get(`${this.$apiUrl}/Produto/`)
                .then(response => {
                    if (response.data && response.data.statusCode == 200) {
                        this.produtos = response.data.object.produtos
                        this.categorias = response.data.object.categorias
                        this.fornecedores = response.data.object.fornecedores
                    }

                    this.carregando = false
                }).catch(error => {
                    this.$swal({
                        title: 'Erro na busca de produtos!',
                        html: `${error?.response?.data?.message ? error.response.data.message : `Tente novamente mais tarde ou acione o suporte.</br> Erro: ${error}`}`,
                        icon: 'error',
                    })

                    this.carregando = false
                })
        },
        deletarProduto(produto) {
            this.$swal({
                title: 'Deletar produto?',
                text: `O produto '${produto.nome}' será deletado. Realmente deseja prosseguir?`,
                icon: 'warning',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Deletar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    this.carregando = true

                    axios.delete(`${this.$apiUrl}/Produto/${produto.id}`)
                        .then(res => {
                            if (res.status == 204) {
                                this.$swal({
                                    title: 'Sucesso!',
                                    text: `O produto '${produto.nome}' foi deletado com sucesso.`,
                                    icon: 'success',
                                    confirmButtonColor: '#37474f'
                                })

                                this.produtos = this.produtos.filter(p => p.id != produto.id)
                            }
                            
                            this.carregando = false
                        }).catch(error => {
                            this.$swal({
                                title: 'Erro na deleção!',
                                html: `Tente novamente mais tarde ou acione o suporte. </br> Erro: ${error}`,
                                icon: 'error',
                            })

                            this.carregando = false
                        })
                },
                allowOutsideClick: () => !this.$swal.isLoading()
            })
        },
        mostrarModalAlteracao(produto) {
            this.modalProduto.modo = 'Editar'

            this.modalProduto.formulario = {
                id: produto.id, nome: produto.nome, codigoEan: produto.codigoEan,  preco: produto.preco, fabricante: produto.fabricante, quantia: produto.quantia,
                fornecedores: this.fornecedores.filter(f => produto.fornecedores.includes(f.id)),
                categoria: this.categorias.filter(c => produto.categoriaId == c.id)
            }

            this.modalProduto.formularioOriginal = JSON.parse(JSON.stringify(this.modalProduto.formulario))

            $('#modalProduto').modal('show')
        },
        nomeDaCategoria(categoriaId) { return this.categorias.find(c => c.id == categoriaId).nome },
        formatToCurrency(num) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(num)
        },
        handlerProdutoAtualizado(produtoAtualizado) { this.produtos = this.produtos.map(p => produtoAtualizado.id === p.id ? produtoAtualizado : p); },
        handlerProdutoCriado(produtoCriado) { this.produtos.push(produtoCriado) },
        toggleBotoesProduto(produtoId) {
            this.botoesProduto.mostrar = !this.botoesProduto.mostrar
            this.botoesProduto.produtoId = produtoId
        },
        windowResize() { this.windowWidth = window.innerWidth },
        mostrarScanner() {
            $('#products-scanner').modal('show')
            this.scanner.active = true
        },
        scanResultado(eanEscaneado) {
            this.scanner.active = false
            $('#products-scanner').modal('hide')

            let produto = this.produtos.find(p => p.codigoEan === eanEscaneado)

            this.mostrarModalAlteracao(produto)
        }
    }
}
</script>

<template>
    <section class="bg-white-dark">
        <div v-if='(produtos.length <= 0)' class="text-white text-center bg-dark p-3 mb-3 rounded">
            <p v-if='!carregando' class="h4">
                Não há produtos registrados
            </p>
            <i v-else class="fa fa-spinner fa-pulse fa-3x"></i>
        </div>
        
        <div id='accordion' class="container p-3 pt-5">
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
                    <button class="btn bg-bg-light text-white hover-button mr-3" @click="mostrarScanner" data-backdrop="static">
                        <i class="fas fa-barcode"></i> Escanear
                    </button>
                    <button class="btn bg-bg text-white hover-button" data-backdrop="static" data-toggle="modal" data-target="#modalProduto" @click="modalProduto.modo = 'Criar'"><i class="fa fa-plus"></i> Produto</button>
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
                <div v-for="(produto, index) in produtosFiltrados" :key="produto.id" class="card shadow">
                    <div class="card-header p-0">
                        <button class="btn d-flex py-3 bg-bg btn-block text-left text-white"
                         data-toggle="collapse"
                         :data-target="`#collapse-${produto.id}`">
                            <div class="col-md-6 col-5 ellipsis">{{ produto.nome}}</div>
                            <div class="col-md-3 col-3">{{ formatToCurrency(produto.preco) }}</div>
                            <div class="col-md-3 col-4 d-flex">
                                <p class="mr-3">{{ produto.quantia }}</p>
                                
                                <button class="btn hover-button ml-auto my-auto bg-bg-light botao-ellipsis" @click="toggleBotoesProduto(produto.id)">
                                    <i class="fas fa-ellipsis-v text-white"></i>
                                </button>

                                <div class="ml-auto botoes-produto-container" v-show="(botoesProduto.mostrar && produto.id === botoesProduto.produtoId) || windowWidth > 560">
                                    <button class="btn hover-button bg-bg-light" @click="deletarProduto(produto)">
                                        <i class="fa fa-trash text-white"></i>
                                    </button>
                                    |
                                    <button class="btn hover-button bg-bg-light" @click="mostrarModalAlteracao(produto)">
                                        <i class="fa fa-pen text-white"></i>
                                    </button>
                                </div>
                            </div>
                        </button>

                        <div class="card-body p-0">
                            <div class="collapse" :class="{ 'show': index == 0 }" :id="`collapse-${produto.id}`" data-parent="#accordion">
                                <div class="card-body d-flex bg-bg-light text-white">
                                    <div class="col-md-6 col-4" data-toggle="tooltip" title="Categoria" data-placement="bottom">{{ nomeDaCategoria(produto.categoriaId) }}</div>
                                    <div class="col-md-3 col-4" data-toggle="tooltip" title="Fabricante" data-placement="bottom">{{ produto.fabricante }}</div>
                                    <div class="col-md-3 col-4" data-toggle="tooltip" title="Código EAN" data-placement="bottom">{{ produto.codigoEan }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
            </div>
            
            <ScannerModal id='products-scanner' :active="scanner.active" :produtosEan="produtos.map(p => p.codigoEan)" @disable-scanner="scanner.active = false" @scanner-result-products="scanResultado"></ScannerModal>
            <ProdutoModal v-bind="modalProduto" :produtos="produtos" :fornecedores="fornecedores" :categorias="categorias" :userComponent="'ProductsView'" @produto-atualizado="handlerProdutoAtualizado" @produto-criado="handlerProdutoCriado"/>
        </div>
    </section>
</template>

<style scoped>
video {
    min-width: 100% !important;
}

.botao-ellipsis { display: none }

@media (max-width: 560px) {
    .botoes-produto-container {
        display: block;
        background-color: var(--blue-grey-dark);
        padding: .5rem;
        position: absolute;
        left: -20px;
        top: -5px;
    }

    .botoes-produto-container::after {
        content: '';
        position: absolute;
        background-color: transparent;
        top: 50%;
        transform: translateY(-50%);
        right: -10px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid var(--blue-grey-dark);
    }

    .botao-ellipsis {
        display: block;
    }
}

@media (max-width: 460px) { .botoes-produto-container { left: -3rem; } }
@media (max-width: 375px) { .botoes-produto-container { left: -5rem; } }
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>