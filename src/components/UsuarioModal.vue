<script>
import axios, * as others from 'axios'
import { areObjectsEqual, AlertCancelamento } from '../assets/helper'

export default {
    name: 'user-modal',
    props: [ 'usuario', 'usuarioOriginal', 'modo', 'acessos', 'usuarios' ],
    data: () => ({
        isMultiselectDisabled: false
    }),
    computed: {
        formularioFoiAlterado() {
            if (this.modo !== 'Editar') return false

            return !areObjectsEqual(this.usuarioOriginal, this.usuario)
        }
    },
    methods: {
        criarUsuario() {
            let mensagemErro = { title: '', text: '' }

            if (!(this.usuario.usuario != '' || this.usuario.email != '' || this.usuario.acessos.length > 0))
                [ mensagemErro.title, mensagemErro.text ] = [ 'Formulário incompleto!', 'Preencha todos os campos requeridos para salvar a criação' ]

            if (this.usuarios.some(u => u.email.toLowerCase().trim() == this.usuario.email.toLowerCase().trim()))
                [ mensagemErro.title, mensagemErro.text ] = [ 'E-mail já utilizado!', 'Este e-mail já pertence a outro usuário.' ] 

            if (mensagemErro.text != '') {
                this.$swal({
                    title: mensagemErro.title,
                    text: mensagemErro.text,
                    icon: 'warning',
                    confirmButtonColor: '#37474f'
                })
                return
            }

            this.carregando = true

            let usuarioRequest = { usuario: this.usuario.usuario, email: this.usuario.email, acessos: this.usuario.acessos.map(a => a.id), admin: this.usuario.admin, ativo: this.usuario.ativo }

            axios.post(`${this.$apiUrl}/Usuarios`, usuarioRequest)
            .then(res => {
                if (res.status == 201) {
                    $('#modal-usuario').modal('hide')
                    
                    this.$swal({
                        title: 'Sucesso!',
                        text: `O usuário '${this.usuario.usuario}' foi registrado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    this.$emit('usuarioCriado', {id: res.data.object, usuario: this.usuario.usuario, email: this.usuario.email, acessos: this.usuario.acessos, admin: this.usuario.admin, ativo: this.usuario.ativo})
                    this.limparFormulario()
                }

                this.carregando = false
            }).catch(error => {
                this.$swal({
                    title: 'Erro na criação!',
                    html: `${error?.response?.data?.message ? error.response.data.message : `Tente novamente mais tarde ou acione o suporte.</br> Erro: ${error}`}`,
                    icon: 'error',
                })
                
                this.carregando = false
            })
        },
        atualizarUsuario() {
            let usuarioRequest = { id: this.usuario.id, usuario: this.usuario.usuario, email: this.usuario.email, ativo: this.usuario.ativo, admin: this.usuario.admin, acessos: this.usuario.acessos.map(a => a.id) }

            axios.put(`${this.$apiUrl}/Usuarios`, usuarioRequest)
            .then(res => {
                $('#modal-usuario').modal('hide')

                if (res.status == 204) {
                    let u = this.usuario
                    let usuarioAtualizado = {
                        id: u.id, usuario: u.usuario, email: u.email, ativo: u.ativo, admin: u.admin, acessos: u.acessos.map(a => a.id)
                    }

                    this.$emit('usuarioAtualizado', usuarioAtualizado)

                    this.$swal({
                        title: 'Sucesso!',
                        text: `O usuário '${this.usuarioRequest.usuario}' foi atualizado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    this.limparFormulario()
                }
                else {
                    this.$swal({
                        title: 'Ocorreu um erro!',
                        text: `${res?.data?.message}`,
                        icon: 'error',
                        confirmButtonColor: '#37474f'
                    })
                }
            }).catch(error => {
                this.$swal({
                    title: 'Erro na atualização!',
                    html: `${error?.response?.data?.message ? error.response.data.message : `Tente novamente mais tarde ou acione o suporte.</br> Erro: ${error}`}`,
                    icon: 'error',
                })
            })
        },
        adminClickHandler() {
            if (this.usuario.acessos.length != this.acessos.length) {
                this.isMultiselectDisabled = true
                this.usuario.acessos = this.acessos
            }
            else {
                this.usuario.acessos = []
                this.isMultiselectDisabled = false
            }
        },
        salvar() {
            if (this.modo == 'Criar') this.criarUsuario()
            else this.atualizarUsuario()
        },
        cancelar() {
            let u = this.usuario
            
            if ((this.modo == 'Editar' && this.formularioFoiAlterado) || (this.modo == 'Criar' && (u.usuario != '' || u.email != '' || u.acessos != '' || u.admin != null || u.ativo != null)))
                AlertCancelamento('#modal-usuario', this.limparFormulario)
            else {
                this.limparFormulario()
                $('#modal-usuario').modal('hide')
            }
        },
        limparFormulario() {
            [ this.usuario.usuario, this.usuario.email, this.usuario.ativo, this.usuario.admin, this.usuario.acessos ] = [ '', '', null, null, '' ]
        },
    }
}
</script>

<template>
    <div class="modal fade" id="modal-usuario">
        <div class="modal-dialog modal-lg modal-dialog-centered text-white">
            <div class="modal-content bg-bg-light">
                <div class="modal-header">
                    <h5 class="modal-title">{{ modo + ' Usuário' }}</h5>
                </div>

                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="usuario">Usuário *</label>
                                <input id='usuario' v-model='usuario.usuario' type="text" class="form-control" required autocomplete="off">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="email">Email *</label>
                                <input id="email" v-model='usuario.email' type="email" class="form-control" autocomplete="off" required>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-check form-switch d-flex align-items-center pl-5 ml-2 col-md-6">
                                <input id='ativo' v-model='usuario.ativo' type="checkbox" class="form-check-input custom-checkbox" role="switch">
                                <label for="ativo" class="form-check-label ml-3">Ativo</label>
                            </div>
                            <div class="form-check form-switch d-flex align-items-center pl-5 col-md-5">
                                <input id="admin" v-model='usuario.admin' type="checkbox" class="form-check-input custom-checkbox" @click='adminClickHandler' role="switch">
                                <label for="admin" class="form-check-label ml-3">Admin</label>
                            </div>
                        </div>

                        <div class="row pt-3">
                            <div class="form-group">
                                <label for="acessos">Acessos *</label>
                                <Multiselect :disabled='isMultiselectDisabled' id="acessos" v-model="usuario.acessos" :options="acessos" label="nome" :multiple="true" track-by="id" selectedLabel="Selecionado" placeholder="Escolha os acessos" required></Multiselect>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button class="btn bg-danger text-light mr-auto" @click="cancelar">Cancelar</button>
                    <button class="btn bg-success text-white" :class="{ disabled: !formularioFoiAlterado && modo == 'Editar' }" @click="salvar" :disabled="!formularioFoiAlterado && modo == 'Editar'">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.custom-checkbox {
    width: 3rem !important;
    height: 1.5rem !important;
}
</style>