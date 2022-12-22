<script>
import JsBarcode from 'jsbarcode'

export default {
    props: { value: [ String, Number ], format: [ String ] },
    watch: {
        value(newValue) { JsBarcode('#barcode', this.value, {format: this.format }) }
    },
    mounted() { JsBarcode('#barcode', this.value, { format: this.format }) }
}
</script>

<template>
    <img id="barcode" />
</template>