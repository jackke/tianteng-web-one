<template>
  <div class="mars-box">
      <CommonTitle categoryName='marsMain'></CommonTitle>
      <div class="content">
         <router-view></router-view>
      </div>
  </div>
</template>

<script>
import CommonTitle from '@/components/CommonTitle'
import "@/style/element-style.scss"
export default {
  name: 'home',
  components: { CommonTitle },
  props: {},
  data() {
    return {
      
    }
  },
  created(){

  },
  mounted(){
  },
  methods: {
     
  }
}
</script>
<style lang="scss" scoped>
.mars-box{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(@/assets/image/bg.png);
  background-size: 100% 100%;
  .content{
    // flex: 1;
    height: 78.5%;
    overflow: hidden;
    margin: 5px 20px 20px 20px;
  }
}


</style>