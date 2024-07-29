@ -1,5 +1,5 @@
<template>
   <dv-full-screen-container>
        <div id="app">
            <router-view />
        </div>
    </dv-full-screen-container>
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
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: inherit;
  }

</style>