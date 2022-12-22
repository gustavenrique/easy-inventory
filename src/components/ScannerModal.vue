<script>
import { StreamBarcodeReader } from 'vue-barcode-reader'

export default {
    name: 'scanner',
    components: { StreamBarcodeReader },
    props: ['active', 'produtosEan', 'userComponent'],
    methods: {
        decodeHandler(decode) {
            console.log(decode);
            
            if (this.produtosEan?.length > 0 && !this.produtosEan.includes(decode)) {
                this.$swal({
                    title: 'Ops',
                    text: `Não foi possível encontrar este pedido. Código EAN inválido: ${decode}`,
                    icon: 'error',
                    confirmButtonColor: '#37474f'
                })
                return
            }

            if (this.userComponent == 'ProductsView')
                this.$emit('scannerResultProducts', decode)
            else if (this.userComponent == 'ProdutoModal')
                this.$emit('scannerResultProdutoModal', decode)
        }
    }
}
</script>

<template>
    <div class="modal fade" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered text-white modal-xl">
            <div class="modal-content bg-bg-light">
                <div class="modal-head p-3 d-flex align-items-center justify-content-between">
                    <h5 class="modal-title">Escanear Barcode ou QR Code</h5>
                    <button class="close text-white" data-dismiss="modal" aria-label="Close" @click="$emit('disableScanner')">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body justify-content-center">
                    <StreamBarcodeReader v-if="active" @decode="decodeHandler"></StreamBarcodeReader>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
video {
    min-width: 100% !important;
}
</style>