<script>
import axios, * as others from 'axios'
import UsuarioModal from '../components/UsuarioModal.vue'

export default {
    name: 'users',
    components: { UsuarioModal },
    data: () => ({
        usuarios: [],
        acessos: [],
        filtro: { usuario: '', acesso: null },
        botoesUsuario: { usuarioId: null, mostrar: false },
        modalUsuario: { 
            modo: '', // Criar, Editar e Visualizar
            usuario: { usuario: '', email: '', admin: null, ativo: null, acessos: [] },
            usuarioOriginal: null
        },
        windowWidth: window.innerWidth,
        carregando: false
    }),
    computed: {
        usuariosFiltrados() {
            let usuario = this.filtro.usuario.toLowerCase()
            let acessoId = this.filtro.acesso?.id

            return !acessoId && !usuario ? this.usuarios
                : usuario && !acessoId ? this.usuarios.filter(u => u.usuario.toLowerCase().includes(usuario))
                : acessoId && !usuario ? this.usuarios.filter(u => u.acessos.includes(acessoId))
                : this.usuarios.filter(u => (u.acessos.includes(acessoId)) && u.usuario.toLowerCase().includes(usuario))
        }
    },
    mounted() {
        this.BuscarUsuarios()

        window.addEventListener('resize', this.windowResize)
    },
    destroyed() {
        window.removeEventListener('resize', this.windowResize)
    },
    methods: {
        BuscarUsuarios() {
            this.carregando = true

            axios.get(`${this.$apiUrl}/Usuarios/`)
                .then(response => {
                    if (response.data && response.data.statusCode == 200) {
                        this.usuarios = response.data.object.usuarios
                        this.acessos = response.data.object.acessos
                    }

                    this.carregando = false
                }).catch(error => {
                    this.$swal({
                        title: 'Erro na busca de usuários!',
                        html: `${error?.response?.data?.message ? error.response.data.message : `Tente novamente mais tarde ou acione o suporte.</br> Erro: ${error}`}`,
                        icon: 'error',
                    })

                    this.carregando = false
                })
        },
        deletarUsuario(usuario) {
            this.$swal({
                title: 'Deletar usuário?',
                text: `O usuário '${usuario.nome}' será deletado. Realmente deseja prosseguir?`,
                icon: 'warning',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Deletar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    this.carregando = true

                    axios.delete(`${this.$apiUrl}/usuarios/${usuario.id}`)
                        .then(res => {
                            if (res.status == 204) {
                                this.$swal({
                                    title: 'Sucesso!',
                                    text: `O usuário '${usuario.usuario}' foi deletado com sucesso.`,
                                    icon: 'success',
                                    confirmButtonColor: '#37474f'
                                })

                                this.usuarios = this.usuarios.filter(p => p.id != usuario.id)
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
            this.modalUsuario.modo = 'Criar'
            $("#modal-usuario").modal('show')
        },
        mostrarFormularioAlteracao(usuario) {
            this.modalUsuario.modo = 'Editar'

            this.modalUsuario.usuario = {
                id: usuario.id, usuario: usuario.usuario, email: usuario.email, ativo: usuario.ativo, admin: usuario.admin, ativo: usuario.ativo, acessos: this.acessos.filter(a => usuario.acessos.includes(a.id))
            }

            this.modalUsuario.usuarioOriginal = JSON.parse(JSON.stringify(this.modalUsuario.usuario))

            $('#modal-usuario').modal('show')
        },
        handlerUsuarioCriado(usuarioCriado) { this.usuarios.push(usuarioCriado) },
        handlerUsuarioAtualizado(usuarioAtualizado) { this.usuarios = this.usuarios.map(u => u.id == usuarioAtualizado.id ? usuarioAtualizado : u) },
        toggleBotoesUsuario(usuarioId) {
            this.botoesUsuario.mostrar = !this.botoesUsuario.mostrar
            this.botoesUsuario.usuarioId = usuarioId
        },
        windowResize() { this.windowWidth = window.innerWidth },
    }
}
</script>

<template>
    <section class="bg-white-dark">
        <div v-if='(usuarios?.length <= 0)' class="text-white text-center bg-dark p-3 mb-3 rounded">
            <p v-if='!carregando' class="h4">
                Não há usuários registrados
            </p>
            <i v-else class="fa fa-spinner fa-pulse fa-3x"></i>
        </div>

        <div class="container p-3 pt-5">
            <div class="mb-3">
                <div class="d-flex flex-column flex-md-row">
                    <input v-model="filtro.usuario" type="text" class="form-control mr-md-5 mb-3" placeholder="Filtre por nome">

                    <Multiselect
                        v-model="filtro.acesso"
                        :options="acessos" 
                        label="nome" 
                        track-by="id"
                        selectedLabel="Selecionado"
                        placeholder="Filtre por acesso">
                    </Multiselect>
                </div>

                <div class="pt-3 d-flex justify-content-end">
                    <button class="btn bg-bg text-white hover-button" @click="mostrarFormularioCriacao()"><i class="fa fa-plus"></i> Usuário</button>
                </div>
            </div>

            <div v-if="usuarios.length">
                <div class="card bg-bg-dark text-white">
                    <div class="row p-3">
                        <div class="col-md-3 col-4 pl-4">Usuario</div>
                        <div class="col-md-3 col-4">Ativo</div>
                        <div class="col-md-3 col-4">E-mail</div>
                    </div>
                </div>

                <div class="card shadow" v-for="usuario in (usuariosFiltrados || usuarios)" :key="usuario.id">
                    <div class="card-body p-0 d-flex py-3 bg-bg text-left text-white">
                        <div class="col-3 ellipsis">{{ usuario.usuario }}</div>
                        <div class="col-3 ellipsis">
                            <i :class="`fa-solid ${ usuario.ativo ? 'fa-check' : 'fa-x'}`"></i>
                        </div>
                        <div class="col-6 d-flex">
                            <p class="mr-3 ellipsis">{{ usuario.email }}</p>
                            
                            <button class="btn hover-button ml-auto my-auto bg-bg-light botao-ellipsis" @click="toggleBotoesUsuario(usuario.id)">
                                <i class="fas fa-ellipsis-v text-white"></i>
                            </button>

                            <div class="ml-auto botoes-usuario-container " v-show="(botoesUsuario.mostrar && usuario.id === botoesUsuario.usuarioId) || windowWidth > 560">
                                <button class="btn hover-button bg-bg-light" @click="deletarUsuario(usuario)">
                                    <i class="fa fa-trash text-white"></i>
                                </button>
                                |   
                                <button class="btn hover-button bg-bg-light" @click="mostrarFormularioAlteracao(usuario)">
                                    <i class="fa fa-pen text-white"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UsuarioModal v-bind="modalUsuario" :acessos='acessos' :usuarios="usuarios" @usuario-atualizado="handlerUsuarioAtualizado" @usuario-criado="handlerUsuarioCriado" />
        </div>
    </section>
</template>