<template>
    <div class="pdf">
      <pdf
        ref="pdf"
        v-for="i in numPages"
        :key="i"
        :src="url"
        :page="i"
        @page-loaded="pro($event)"
      ></pdf>
    </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  components: {pdf},
  data() {
    return {
      url:"/static/aaa.pdf",
      numPages: null, // pdf 总页数
      page:0,
    }
  },

  created() {
    //this.src = pdf.createLoadingTask(this.src)
    this.getNumPages()
  },
  methods: {
    getNumPages() {
      let loadingTask = pdf.createLoadingTask(this.url)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        console.error('pdf 加载失败', err);
      })
    },
    pro(val){

    },

  }
}
</script>

<style scoped>

</style>
