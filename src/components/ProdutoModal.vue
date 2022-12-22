<script>
import axios, * as others from 'axios'
import ScannerModal from '../components/ScannerModal.vue'
import Barcode from '../components/Barcode.vue'
import QrcodeVue from 'qrcode.vue'

const areObjectsEqual = (first, second) => {
    let firstKeys = Object.keys(first)
    let secondKeys = Object.keys(second)

    if (firstKeys.length !== secondKeys.length) return false
    
    for (let key of firstKeys) {
        const areValuesAnObject = isObject(first[key]) && isObject(second[key])

        if ((areValuesAnObject && !areObjectsEqual(first[key], second[key])) || (!areValuesAnObject && first[key] !== second[key]))
            return false
    }

    return true
}

const isObject = (object) => object != null && typeof object === 'object'

export default {
    props: [ 'formulario', 'formularioOriginal', 'modo', 'fornecedores', 'categorias' ],
    components: { ScannerModal, Barcode, QrcodeVue },
    computed: {
        formularioFoiAlterado() {
            if (this.modo !== 'Editar') return false

            return !areObjectsEqual(this.formularioOriginal, this.formulario)
        }
    },
    data: () => ({
        scannerActive: false
    }),
    methods: {
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
                        text: `O produto '${f.nome}' foi registrado com sucesso.`,
                        icon: 'success',
                        confirmButtonColor: '#37474f'
                    })

                    // atualizando lista de produtos na mão (para evitar reconsulta em banco)
                    let produtoCriado = {
                        id: res.data.object, nome: f.nome, preco: f.preco, fabricante: f.fabricante, quantia: f.quantia, codigoEan: f.codigoEan, categoriaId: f.categoria.id,
                        fornecedores: f.fornecedores.map(fornecedor => fornecedor.id)
                    }

                    this.$emit('produtoCriado', produtoCriado)
                    this.limparFormulario()
                }

                this.carregando = false
            }).catch(error => {
                this.$swal({
                    title: 'Erro na criação!',
                    html: `Tente novamente mais tarde ou acione o suporte. </br> Erro: ${error}`,
                    icon: 'error',
                })
                
                this.carregando = false
            })
        },
        atualizarProduto() {
            axios.put(`${this.$apiUrl}/Produto`, {
                id: this.formulario.id, nome: this.formulario.nome, codigoEan: this.formulario.codigoEan, preco: this.formulario.preco,
                quantia: this.formulario.quantia, fabricante: this.formulario.fabricante, fornecedores: this.formulario.fornecedores.map(f => f.id), categoriaId: this.formulario.categoria[0].id
            }).then(res => {
                $('#modalProduto').modal('hide')

                if (res.status == 204) {
                    let f = this.formulario
                    let produtoAtualizado = {
                        id: f.id, nome: f.nome, preco: f.preco, fabricante: f.fabricante, quantia: f.quantia, codigoEan: f.codigoEan, categoriaId: f.categoria[0].id,
                        fornecedores: f.fornecedores.map(fornecedor => fornecedor.id)
                    }

                    this.$emit('produtoAtualizado', produtoAtualizado)

                    this.$swal({
                        title: 'Sucesso!',
                        text: `O produto '${this.formularioOriginal.nome}' foi atualizado com sucesso.`,
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
            if (this.modo == 'Criar') this.criarProduto()
            else this.atualizarProduto()
        },
        cancelar() {
            var f = this.formulario
            
            if ((this.modo == 'Editar' && this.formularioFoiAlterado) || (this.modo == 'Criar' && (f.nome != '' || f.preco != null || f.codigoEan != '' || f.quantia != null || f.categoria != '' || f.fornecedores.length > 0)))
                this.mostrarSweetAlertCancelamento()
            else {
                this.limparFormulario()
                $('#modalProduto').modal('hide')
            }
            
        },
        mostrarSweetAlertCancelamento() {
            this.$swal({
                    title: 'Tem certeza?',
                    text: 'Os dados inseridos serão perdidos. Realmente deseja cancelar?',
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
        },
        limparFormulario() {
            [this.formulario.nome, this.formulario.codigoEan, this.formulario.preco, this.formulario.fabricante,
            this.formulario.quantia, this.formulario.categoria, this.formulario.fornecedores] = ['', '', null, '', null, '', '']
        },
        mostrarScanner() {
            $('#produto-modal-scanner').modal('show')
            this.scannerActive = true
        },
        decodeResult(eanEscaneado) {
            this.scannerActive = false
            $('#produto-modal-scanner').modal('hide')
            this.formulario.codigoEan = eanEscaneado
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
                            <label for="codigoEan">Código de Barras *</label>
                            <div class="input-group">
                                <input id="codigoEan" v-model='formulario.codigoEan' type="text" class="form-control" autocomplete="off" maxlength="13" minlength="13">
                                <div class="input-group-append">
                                    <div class="btn bg-bg-dark text-white" @click="mostrarScanner">Escanear</div>
                                </div>
                            </div>
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

                <div class="d-flex justify-content-center" v-if="formulario.codigoEan.length > 0">
                    <div class="col-6 d-flex justify-content-center">
                        <Barcode :value="formulario.codigoEan" format="CODE128"/>
                    </div>
                    <div class="col-6 d-flex justify-content-center">
                        <qrcode-vue :value="formulario.codigoEan" :size="140"></qrcode-vue>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn bg-danger text-light mr-auto" @click="cancelar">Cancelar</button>
                <button class="btn bg-success text-white" :class="{ disabled: !formularioFoiAlterado && modo == 'Editar' }" @click="salvar" :disabled="!formularioFoiAlterado && modo == 'Editar'">Salvar</button>
            </div>
        </div>

        <ScannerModal id="produto-modal-scanner" :active="scannerActive" :userComponent="'ProdutoModal'" @disable-scanner="scannerActive = false" @scanner-result-produto-modal="decodeResult"></ScannerModal>
    </div>
</div>
</template>

<style>
</style>