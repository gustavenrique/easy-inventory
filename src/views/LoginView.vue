<script>
import axios, * as others from 'axios'
import { sha256 } from 'js-sha256';

export default {
    name: 'loginView',
    props: {},
    data: () => ({
        formulario: {
            username: "",
            password: "",
            passInputType: "password"
        },
        validacao: {
            campoVazio: false,
        },
        usuarioResponse: {
            objeto: null,
            mensagem: "",
        },
        carregando: false,
        mensagem: {
            texto: '',
            cor: ''
        }
    }),
    computed: {
        icon() {
            return this.formulario.passInputType === 'password' ? 'fa-eye' : 'fa-eye-slash'
        },
        botaoLoginAtivo() {
            return this.formulario.username && this.formulario.password
        }
    },
    methods: {
        login() {
            this.carregando = true

            axios.post("http://localhost:5025/Usuarios/LogarUsuario", {
                usuario: this.formulario.username,
                senha: sha256(this.formulario.password)
            }).then(response => {
                if (response.data && response.data.statusCode == 200) {
                    this.usuarioResponse = response.data.object
                    this.mensagem.texto = response.data.message
                    this.mensagem.cor = "success"
                }

                window.user = this.formulario.username
                this.$router.push(this.$route.query.redirect || '/')
            }).catch(error => {
                this.mensagem.texto = "Ocorreu um erro ao fazer login! Tente novamente mais tarde."
                this.mensagem.cor = "danger"
            }).finally(() => {
                this.carregando = false
            })
        },
        blink() {
            if (this.formulario.passInputType == 'password') this.formulario.passInputType = 'text'
            else this.formulario.passInputType = 'password'
        }
    }
}
</script>

<template>
    <div class="container-fluid bg-secondary d-flex align-items-center justify-content-center flex-column vh-100">
        <form class="form p-4 rounded bg-white" @submit.prevent="login">
            <h1 class="text-center">Login</h1>
            
            <div class="form-group">
                <label for="usuario">Usuário</label>
                <input v-model='formulario.username' name='usuario' class="form-control" type="text" required>
            </div>
            
            <div class="form-group">
                <label for="senha">Senha</label>
                
                <div class="d-flex flex-row input-group">
                    <input v-model='formulario.password' name='senha' class='form-control' :type="formulario.passInputType" autocomplete="off" required>
    
                    <div @click="blink" class="eye bg-secondary text-white align-items-center justify-content-center px-2 input-group-append">
                        <i :class="`fa-solid ${icon}`"></i>
                    </div>
                </div>
            </div>
            
            <p v-if='mensagem.texto' :class="`text-${mensagem.cor} font-weight-bold`">{{ mensagem.texto }}</p>

            <button :disabled='!botaoLoginAtivo' class="btn btn-dark btn-block text-white" type='submit'>
                <div v-if="botaoLoginAtivo">
                    <span v-if="!carregando">Login</span> <i v-if='carregando' class="fa fa-spinner fa-pulse text-white"></i>
                </div>

                <span v-if="!botaoLoginAtivo">Preencha os campos</span>
            </button>

            <div class="text-muted pt-2">
                Não possui conta? Comunique-se com o administrador.
            </div>
        </form>
    </div>
</template>

<style>
.eye {
    cursor: pointer;
}
</style>