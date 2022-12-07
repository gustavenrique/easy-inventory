<script>
import axios, * as others from 'axios'

export default {
    props: [ 'formulario', 'modo', 'fornecedores', 'categorias' ],
    data: () => ({

    }),
    computed: {
    },
    methods: {
        cancelarCriacaoProduto() {
            let f = this.formulario

            if (this.formulario.nome != '' || this.formulario.preco != null || this.formulario.codigoEan != '' || this.formulario.quantia != null || this.formulario.categoria != '' || this.formulario.fornecedores.length > 0)
                this.$swal({
                    title: 'Tem certeza?',
                    text: 'Os dados inseridos serão perdidos. Realmente deseja cancelar a criação?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, cancele',
                    cancelButtonText: 'Não, volte'
                }).then(result => {
                    if (result.isConfirmed) {
                        this.limparFormulario()
                        $('#modalProduto').modal('hide')
                    }
                })
            else $('#modalProduto').modal('hide')

        },
        criarProduto() {
            if (!(this.formulario.nome != '' && this.formulario.preco != null && this.formulario.codigoEan != '' && this.formulario.quantia != null && this.formulario.categoria != '' && this.formulario.fornecedores.length > 0)) {
                this.$swal({
                    title: 'Formulário incompleto!',
                    text: 'Preencha todos os campos requeridos para salvar a criação',
                    icon: 'warning',
                    confirmButtonColor: '#37474f'
                })
                return
            }

            this.carregando = true

            let f = this.formulario
            axios.post(`${this.$apiUrl}/Produto`, {
                nome: f.nome, codigoEan: f.codigoEan, preco: f.preco, fabricante: f.fabricante, quantia: f.quantia, categoriaId: f.categoria.id, fornecedores: f.fornecedores.map(f => f.id)
            }).then(res => {
                if (res.status == 201) {
                    $('#modalProduto').modal('hide')
                    
                    this.$swal({
                        title: 'Sucesso!',
                        text: `O produto ${f.nome} foi registrado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    this.limparFormulario()
                }

                this.carregando = false
            }).catch(error => {
                console.log(error)

                this.$swal({
                    title: 'Erro na criação!',
                    html: `Tente novamente mais tarde ou acione o suporte. </br> Erro: ${error}`,
                    icon: 'error',
                })
                
                this.carregando = false
            })
        },
        limparFormulario() {
            [this.formulario.nome, this.formulario.codigoEan, this.formulario.preco, this.formulario.fabricante,
            this.formulario.quantia, this.formulario.categoria, this.formulario.fornecedores] = ['', '', null, '', null, '', '']
        }
    }
}
</script>

<template>
<div class="modal fade" id="modalProduto">
    <div class="modal-dialog modal-lg modal-dialog-centered text-white">
        <div class="modal-content bg-bg-light">
            <div class="modal-header">
                <h5 class="modal-title">{{ modo + ' Produto' }}</h5>
            </div>

            <div class="modal-body">
                <form>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="nome">Nome *</label>
                            <input id='nome' v-model='formulario.nome' type="text" class="form-control" required autocomplete="off">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="codigoEan">Código EAN *</label>
                            <input id="codigoEan" v-model='formulario.codigoEan' type="text" class="form-control" autocomplete="off">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="preco">Preço (R$) *</label>
                            <input id="preco" v-model='formulario.preco' type="number" min='.1' step='.1' class="form-control" placeholder="e.g. 15,99" autocomplete="off" required>
                        </div>
                        
                        <div class="form-group col-md-6">
                            <label for="quantia">Em Estoque *</label>
                            <input v-model='formulario.quantia' id="quantia" min="1" step="1" type="number" class="form-control" autocomplete="off">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="fornecedores">Fornecedor *</label>
                            <Multiselect id="fornecedores" v-model="formulario.fornecedores" :options="fornecedores" :multiple="true" label="nome" track-by="id" selectedLabel="Selecionado" placeholder="Escolha o fornecedor" required></Multiselect>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="categoria">Categoria *</label>
                            <Multiselect id="categoria" v-model="formulario.categoria" :options="categorias" label="nome"  track-by="id" selectedLabel="Selecionado" placeholder="Escolha a categoria" required></Multiselect>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="fabricante">Fabricante</label>
                        <input v-model='formulario.fabricante' id="fabricante" type="text" class="form-control" autocomplete="off">
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn bg-danger text-light mr-auto" @click="cancelarCriacaoProduto">Cancelar</button>
                <button class="btn bg-success text-white" @click="criarProduto">Salvar</button>
            </div>
        </div>
    </div>
</div>
</template>

<style>
</style>