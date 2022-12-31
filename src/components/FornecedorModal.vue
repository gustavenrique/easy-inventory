<script>
import axios, * as others from 'axios'
import { areObjectsEqual, AlertCancelamento } from '../assets/helper'

export default {
    name: 'supplier-modal',
    props: [ 'fornecedor', 'fornecedorOriginal', 'modo', 'fornecedores' ],
    computed: {
        formularioFoiAlterado() {
            if (this.modo !== 'Editar') return false

            return !areObjectsEqual(this.fornecedorOriginal, this.fornecedor)
        },
    },
    methods: {
        criarFornecedor() {
            let mensagemErro = { title: '', text: '' }

            if (!(this.fornecedor.nome != '' || this.fornecedor.email != '' || this.fornecedor.telefone != ''))
                [ mensagemErro.title, mensagemErro.text ] = [ 'Formulário incompleto!', 'Preencha todos os campos requeridos para salvar a criação' ]

            if (!this.fornecedor.telefone.match(/^\+[0-9]{2} \([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/) || !this.fornecedor.telefone.length > 19)
                [ mensagemErro.title, mensagemErro.text ] = [ 'Telefone errado!', 'Preencha o telefone com a quantia certa de dígitos' ] 

            if (this.fornecedores.some(f => f.email.toLowerCase().trim() == this.fornecedor.email.toLowerCase().trim()))
                [ mensagemErro.title, mensagemErro.text ] = [ 'E-mail já utilizado!', 'Este e-mail já pertence a outro fornecedor.' ] 

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

            axios.post(`${this.$apiUrl}/Fornecedor`, this.fornecedor)
            .then(res => {
                if (res.status == 201) {
                    $('#modal-fornecedor').modal('hide')
                    
                    this.$swal({
                        title: 'Sucesso!',
                        text: `O fornecedor '${this.fornecedor.nome}' foi registrado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    this.$emit('fornecedorCriado', {id: res.data.object, nome: this.fornecedor.nome, email: this.fornecedor.email, telefone: this.fornecedor.telefone})
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
        atualizarFornecedor() {
            axios.put(`${this.$apiUrl}/fornecedor`, this.fornecedor)
            .then(res => {
                $('#modal-fornecedor').modal('hide')

                if (res.status == 204) {
                    let f = this.fornecedor
                    let fornecedorAtualizado = {
                        id: f.id, nome: f.nome, email: f.email, telefone: f.telefone
                    }

                    this.$emit('fornecedorAtualizado', fornecedorAtualizado)

                    this.$swal({
                        title: 'Sucesso!',
                        text: `O fornecedor '${this.fornecedorOriginal.nome}' foi atualizado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    this.limparFormulario()
                }
                else {
                    this.$swal({
                        title: 'Ocorreu um erro!',
                        text: `${res.data.message}`,
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
        salvar() {
            if (this.modo == 'Criar') this.criarFornecedor()
            else this.atualizarFornecedor()
        },
        cancelar() {
            var f = this.fornecedor
            
            if ((this.modo == 'Editar' && this.formularioFoiAlterado) || (this.modo == 'Criar' && (f.nome != '' || f.email != '' || f.telefone != '')))
                AlertCancelamento('#modal-fornecedor', this.limparFormulario)
            else {
                this.limparFormulario()
                $('#modal-fornecedor').modal('hide')
            }
        },
        limparFormulario() {
            [ this.fornecedor.nome, this.fornecedor.email, this.fornecedor.telefone ] = [ '', '', '' ]
        },
        telefoneInputHandler(e) {
            var digits = e.target.value.match(/\d/g)?.join('')

            console.log(digits)

            if (digits != null)
                this.fornecedor.telefone = `+${digits.slice(0,2)} (${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9,13)}`
            else 
                this.fornecedor.telefone = ''
        }
    }
}
</script>

<template>
<div class="modal fade" id="modal-fornecedor">
    <div class="modal-dialog modal-dialog-centered modal-lg text-white">
        <div class="modal-content bg-bg-light">
            <div class="modal-header">
                <h5 class="modal-title">{{ modo + ' Fornecedor' }}</h5>
            </div>

            <div class="modal-body">
                <form>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="nome">Nome *</label>
                            <input id='nome' v-model='fornecedor.nome' type="text" class="form-control" required autocomplete="off">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="email">Email *</label>
                            <input id="email" v-model='fornecedor.email' type="email" class="form-control" autocomplete="off" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="telefone">Telefone *</label>
                        <input :value="fornecedor.telefone" @input="telefoneInputHandler" id="telefone" type="text" class="form-control" maxlength="19" autocomplete="off" required>
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