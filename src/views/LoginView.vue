<script>
import axios, * as others from 'axios'
import { sha256 } from 'js-sha256';
import cookies from 'vue-cookies'

export default {
    name: 'loginView',
    props: {},
    data: () => ({
        formulario: { username: "", password: "", passInputType: "password" },
        formularioAlteracaoSenha: { alterarSenha: false, usuarioId: 0, senhaAtual: "", senhaNova: "", confirmacaoSenhaNova: "" },
        validacao: { campoVazio: false },
        usuarioResponse: { objeto: null, mensagem: "", },
        carregando: false,
        mensagem: { texto: '', cor: '' }
    }),
    computed: {
        icon() {
            return this.formulario.passInputType === 'password' ? 'fa-eye' : 'fa-eye-slash'
        },
        botaoLoginAtivo() {
            return this.formularioAlteracaoSenha.alterarSenha 
            ? this.formularioAlteracaoSenha.senhaAtual && this.formularioAlteracaoSenha.senhaNova && this.formularioAlteracaoSenha.confirmacaoSenhaNova 
            : this.formulario.username && this.formulario.password
        }
    },
    methods: {
        logarOuAlterarSenha() {
            if (this.formularioAlteracaoSenha.alterarSenha) this.alterarSenha()
            else this.login()
        },
        login() {
            this.carregando = true

            axios.post(`${this.$apiUrl}/Usuarios/Login`, {
                usuario: this.formulario.username,
                senha: sha256(this.formulario.password)
            }).then(response => {
                if (response.data && response.data.statusCode == 200) {
                    this.usuarioResponse = response.data.object
                    this.mensagem.texto = response.data.message
                    this.mensagem.cor = "success"
                }

                cookies.set('username', this.formulario.username, '30MIN') // user cookie expires after 30min
                cookies.set('userId', response.data.object.usuarioId, '30MIN')
                cookies.set('userAccess', response.data.object.usuarioAcessos, '30MIN')
                this.$router.go()
                this.$router.push(this.$route.query.redirect || '/')
            }).catch(error => {
                if (error?.response?.data)
                    this.mensagem.texto = error.response.data.message
                else 
                    this.mensagem.texto = "Ocorreu um erro ao fazer login! Tente novamente mais tarde."
                
                if (error?.response?.data?.statusCode == 412) {
                    this.formularioAlteracaoSenha.alterarSenha = true
                    this.formularioAlteracaoSenha.usuarioId = error.response.data.object.usuarioId
                }                    
                    
                this.mensagem.cor = "danger"
            }).finally(() => {
                this.carregando = false
            })
        },
        alterarSenha() {
            const f = this.formularioAlteracaoSenha

            this.carregando = true

            if (f.senhaAtual != this.formulario.password) {
                this.mensagem.texto = "Senha atual incorreta."
                this.mensagem.cor = 'danger'
                this.carregando = false
                return
            }

            if (f.senhaNova != f.confirmacaoSenhaNova) {
                this.mensagem.texto = "Confirmação incorreta da nova senha."
                this.mensagem.cor = 'danger'
                this.carregando = false
                return
            }

            axios.patch(`${this.$apiUrl}/Usuarios/AlterarSenha`, { usuarioId: f.usuarioId, senhaAtual: sha256(f.senhaAtual), senhaNova: sha256(f.senhaNova)})
            .then(response => {
                if (response.data && response.data.statusCode == 200) {
                    this.usuarioResponse = response.data.object
                    this.mensagem.texto = response.data.message
                    this.mensagem.cor = "success"
                }

                cookies.set('username', this.formulario.username, '30MIN') // user cookie expires after 30min
                cookies.set('userId', response.data.object.usuarioId, '30MIN')
                cookies.set('userAccess', response.data.object.usuarioAcessos, '30MIN')
                this.$router.go()
                this.$router.push(this.$route.query.redirect || '/')
            }).catch(error => {
                if (error?.response?.data)
                    this.mensagem.texto = error.response.data.message
                else 
                    this.mensagem.texto = "Ocorreu um erro ao alterar a senha. Tente novamente mais tarde."                    
                    
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
    <div class="container-fluid bg-bg d-flex align-items-center justify-content-center flex-column">
        
        <form class="form p-4 rounded bg-white" @submit.prevent="logarOuAlterarSenha">
            <div class="container text-center mb-3 bg-white rounded">
                <h1 class="color-bg-dark">
                    <span class="display-4 font-weight-bold">St</span><i class="fas fa-pie-chart" style="font-size: 2.25rem"></i><span class="display-4 font-weight-bold">quei</span>
                </h1>
            </div>

            <div v-if="!formularioAlteracaoSenha.alterarSenha"> <!--formulário para login -->
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
            </div>

            <div v-else> <!--formulário para alteração de senha -->
                <div class="form-group">
                    <label for="senhaAtual">Senha Atual</label>
                    
                    <div class="d-flex flex-row input-group">
                        <input v-model='formularioAlteracaoSenha.senhaAtual' name='senhaAtual' class='form-control' :type="formulario.passInputType" autocomplete="off" required>
        
                        <div @click="blink" class="eye bg-secondary text-white align-items-center justify-content-center px-2 input-group-append">
                            <i :class="`fa-solid ${icon}`"></i>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="senhaNova">Senha Nova</label>
                    
                    <div class="d-flex flex-row input-group">
                        <input v-model='formularioAlteracaoSenha.senhaNova' name='senhaNova' class='form-control' :type="formulario.passInputType" autocomplete="off" required>
        
                        <div @click="blink" class="eye bg-secondary text-white align-items-center justify-content-center px-2 input-group-append">
                            <i :class="`fa-solid ${icon}`"></i>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirmarSenhaNova">Confirmar Senha Nova</label>
                    
                    <div class="d-flex flex-row input-group">
                        <input v-model='formularioAlteracaoSenha.confirmacaoSenhaNova' name='confirmarSenhaNova' class='form-control' :type="formulario.passInputType" autocomplete="off" required>
        
                        <div @click="blink" class="eye bg-secondary text-white align-items-center justify-content-center px-2 input-group-append">
                            <i :class="`fa-solid ${icon}`"></i>
                        </div>
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
                Não possui conta? Comunique-se com os seus superiores.
            </div>
        </form>
    </div>
</template>

<style>
.eye {
    cursor: pointer;
}
</style>