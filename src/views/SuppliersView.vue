<script>
import axios, * as others from 'axios'
import FornecedorModal from '../components/FornecedorModal.vue'

export default {
    name: 'suppliers',
    components:  { FornecedorModal },
    data: () => ({
        fornecedores: [],
        filtro: { fornecedor: '' },
        botoesFornecedor: { mostrar: false, fornecedorId: null },
        modalFornecedor: { 
            modo: '', // Criar, Editar e Visualizar
            fornecedor: { nome: '', email: '', telefone: '' },
            fornecedorOriginal: null
        },
        windowWidth: window.innerWidth,
        carregando: false,
    }),
    computed: {
        fornecedoresFiltrados() {
            let fornecedorNome = this.filtro.fornecedor.toLowerCase()

            return !fornecedorNome ? this.fornecedores : this.fornecedores.filter(f => f.nome.toLowerCase().includes(fornecedorNome))
        }
    },
    mounted() {
        this.BuscarFornecedores();

        window.addEventListener('resize', this.windowResize)
    },
    destroyed() { window.removeEventListener('resize', this.windowResize) },
    methods: {
        BuscarFornecedores() {
            this.carregando = true

            axios.get(`${this.$apiUrl}/Fornecedor/`)
                .then(response => {
                    if (response.data && response.status == 200) 
                        this.fornecedores = response.data.object

                    this.carregando = false
                }).catch(error => {
                    this.$swal({
                        title: 'Erro na busca de fornecedores!',
                        html: `${error?.response?.data?.message ? error.response.data.message : `Tente novamente mais tarde ou acione o suporte.</br> Erro: ${error}`}`,
                        icon: 'error',
                    })

                    this.carregando = false
                })
        },
        deletarFornecedor(fornecedor) {
            this.$swal({
                title: 'Deletar fornecedor?',
                text: `O fornecedor '${fornecedor.nome}' será deletado. Realmente deseja prosseguir?`,
                icon: 'warning',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Deletar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    this.carregando = true

                    axios.delete(`${this.$apiUrl}/fornecedor/${fornecedor.id}`)
                        .then(res => {
                            if (res.status == 204) {
                                this.$swal({
                                    title: 'Sucesso!',
                                    text: `O fornecedor '${fornecedor.nome}' foi deletado com sucesso.`,
                                    icon: 'success',
                                    confirmButtonColor: '#37474f'
                                })

                                this.fornecedores = this.fornecedores.filter(p => p.id != fornecedor.id)
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
        mostrarFormularioCriacao() {
            this.modalFornecedor.modo = 'Criar'
            $("#modal-fornecedor").modal('show')
        },
        mostrarFormularioAlteracao(fornecedor) {
            this.modalFornecedor.modo = 'Editar'

            this.modalFornecedor.fornecedor = {
                id: fornecedor.id, nome: fornecedor.nome, email: fornecedor.email, telefone: fornecedor.telefone
            }

            this.modalFornecedor.fornecedorOriginal = JSON.parse(JSON.stringify(this.modalFornecedor.fornecedor))

            $('#modal-fornecedor').modal('show')
        },
        handlerFornecedorCriado(fornecedorCriado) { this.fornecedores.push(fornecedorCriado) },
        handlerFornecedorAtualizado(fornecedorAtualizado) { this.fornecedores = this.fornecedores.map(f => f.id == fornecedorAtualizado.id ? fornecedorAtualizado : f) },
        toggleBotoesFornecedor(fornecedorId) {
            this.botoesFornecedor.mostrar = !this.botoesFornecedor.mostrar
            this.botoesFornecedor.fornecedorId = fornecedorId
        },
        windowResize() { this.windowWidth = window.innerWidth },
    }
}
</script>

<template>
    <section class="bg-white-dark">
        <div v-if='(fornecedores?.length <= 0)' class="text-white text-center bg-dark p-3 mb-3 rounded">
            <p v-if='!carregando' class="h4">
                Não há fornecedores registrados
            </p>
            <i v-else class="fa fa-spinner fa-pulse fa-3x"></i>
        </div>
        
        <div class="container p-3 pt-5">
            <div class="mb-3">
                <input v-model="filtro.fornecedor" type="text" class="form-control mr-md-5 mb-3" placeholder="Filtre por nome">

                <div class="pt-3 d-flex justify-content-end">
                    <button class="btn bg-bg text-white hover-button" @click="mostrarFormularioCriacao()"><i class="fa fa-plus"></i> Fornecedor</button>
                </div>
            </div>

            <div v-if="fornecedores.length">
                <div class="card bg-bg-dark text-white">
                    <div class="row p-3">
                        <div class="col-md-3 col-4 pl-4">Nome</div>
                        <div class="col-md-3 col-4">E-mail</div>
                        <div class="col-md-3 col-4">Telefone</div>
                    </div>

                    <div class="card shadow" v-for="fornecedor in (fornecedoresFiltrados || fornecedores)" :key="fornecedor.id">
                        <div class="card-body p-0 d-flex py-3 bg-bg text-left text-white">
                            <div class="col-3 ellipsis">{{ fornecedor.nome }}</div>
                            <div class="col-3 ellipsis">{{ fornecedor.email }}</div>
                            <div class="col-6 d-flex">
                                <p class="mr-3 ellipsis">{{ fornecedor.telefone }}</p>
                                
                                <button class="btn hover-button ml-auto my-auto bg-bg-light botao-ellipsis" @click="toggleBotoesFornecedor(fornecedor.id)">
                                    <i class="fas fa-ellipsis-v text-white"></i>
                                </button>

                                <div class="ml-auto botoes-fornecedor-container " v-show="(botoesFornecedor.mostrar && fornecedor.id === botoesFornecedor.fornecedorId) || windowWidth > 560">
                                    <button class="btn hover-button bg-bg-light" @click="deletarFornecedor(fornecedor)">
                                        <i class="fa fa-trash text-white"></i>
                                    </button>
                                    |
                                    <button class="btn hover-button bg-bg-light" @click="mostrarFormularioAlteracao(fornecedor)">
                                        <i class="fa fa-pen text-white"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FornecedorModal v-bind="modalFornecedor" :fornecedores="fornecedores" @fornecedor-atualizado="handlerFornecedorAtualizado" @fornecedor-criado="handlerFornecedorCriado" />
        </div>
    </section>
</template>
