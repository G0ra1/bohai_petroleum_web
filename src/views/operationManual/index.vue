<template>
  <div class="pdf">
    <pdf
      ref="pdf"
      src="../../assets/aaa.pdf">
    </pdf>
    <img src="../../assets/designate.png">
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  name: 'Pdf',
  components: {
    pdf
  },
  data() {
    return {
      pdfUrl: "../../assets/aaa.pdf",
    }
  }
}
</script>

<style scoped>

</style>
