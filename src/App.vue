@ -1,5 +1,5 @@
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data () {
    return {
      style: {
        width: 1920,
        height: 1080,
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      },
      styleObj: 'left:50%; top:50%; width: 1920px; height: 1080px; transform: scaleY(1) scaleX(1) translate(-50%, -50%)',
    };
  },
  watch:{
 
  },
  components:{},
  created(){

  },
  mounted () {
    // let that = this;
    // that.setScale();
    // /*窗口改变事件*/
    // $(window).resize(() => {
    //   that.setScale();
    // });
    // this.login()
  },
  methods: {
    // setRem () {
    //   (function (doc, win) {
    //     var docEl = doc.documentElement,
    //       resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    //       recalc = function () {
    //         var clientWidth = docEl.clientWidth;
    //         if (!clientWidth) return;
    //         docEl.style.fontSize = 20 * (clientWidth / 1920) + 'px';
    //       };
    //     if (!doc.addEventListener) return;
    //     win.addEventListener(resizeEvt, recalc, false);
    //     doc.addEventListener('DOMContentLoaded', recalc, false);
    //   })(document, window);
    // },
    // getScale () {
    //   const w = window.innerWidth / this.style.width;
    //   const h = window.innerHeight / this.style.height;
    //   this.scaleX = w
    //   this.scaleY = h
    //   return { x: w, y: h };
    // },
    // setScale () {
    //   let scale = this.getScale();
    //   this.styleObj = `left:50%; top:50%; width: 1920px; height: 1080px; transform: scaleY(${scale.y}) scaleX(${scale.x}) translate(-50%, -50%)`
    //   // this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    // },
    // login(){
    //   this.$store.dispatch('getToken').then(res => {
    //     if (!res){
    //       this.$router.push({name:'login'})
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
  // div, span{
  //   -webkit-text-size-adjust:none;
  //   text-size-adjust: none;
  // }
  #app {
    --font-smoothing: grayscale;
    color: #FFFFFF;
    transform-origin: 0 0;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: inherit;
    /* transition: 0.3s; */
  }
  // .dialog{
  //   background-color: rgba(0, 0, 0, 0.5);
  // }
  // .mask {
  //     position: fixed !important;
  //     width: 100%;
  //     height: 100%;
  //     top: 0;
  //     left: 0;
  //     z-index: 90;
  //     background-color: rgba(0, 0, 0, 0.5);
  // }
</style>