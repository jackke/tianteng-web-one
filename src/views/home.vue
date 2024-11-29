<template>
  <div class="mars-box">
    <div class="headTitle">
        <CommonTitle categoryName='marsMain'></CommonTitle>
    </div>
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
  box-sizing: border-box;

  .headTitle{
    height: 80px;
  }
  .content{
    // height: 88vh;
    flex: 1;
    overflow: hidden;
    margin: 5px 20px 20px 20px;
    box-sizing: border-box;

  }
}


</style>