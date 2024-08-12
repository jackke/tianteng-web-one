@ -1,5 +1,5 @@
<template>
      <div id="app">
          <dv-full-screen-container style="position: absolute;height: 100%;">
            <router-view />
          </dv-full-screen-container>
      </div>
</template>
<script>
export default {
  name: "App",
  data () {
    return {
      
    };
  },
  watch:{
 
  },
  components:{},
  created(){

  },
  mounted () {
  
  },
  methods: {
    
  }
}
</script>

<style>
  #app {
    --font-smoothing: grayscale;
    color: #FFFFFF;
    width: 100vw;
    height: 100vh;
    /* overflow: hidden; */
    overflow-y: auto;
    box-sizing: border-box;
  }

</style>