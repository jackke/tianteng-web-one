<template>
    <div class="menu-list">
        <div v-for="(item, index) in typeList" :key="index" >
            <div class="list" @click="menulistClick(index)">
                <div><i class="el-icon-caret-right"></i></div>
                <div class="text">{{ item.name }}</div>
            </div>
            <div class="list-children" >
                <div :style="item.checked ? 'max-height:500px' : 'max-height:0'">
                        <div v-for="(cItem, cIndex) in item.children" :key="cIndex" :class="cIndex == actionIndex ? 'action' : ''" @click="navclick(cIndex, cItem)"> <span></span> {{ cItem.name }}</div>
                </div>
            </div>
        </div>
    </div>
  </template>
  <script>
    export default {
        name: "", // 分页组件
        components: {},
        props:{
            typeList:[],
            // currentPage:{ // 当前页
    },
    data () {
      return {
        actionIndex: 0,
      };
    },
    mounted() {
     
    },
    methods: {
        menulistClick(index, row){
            this.typeList[index].checked = !this.typeList[index].checked
        },
        navclick(index, row){
            this.actionIndex = index
            this.$emit('navClick', row)
        }
    }
  }
  </script>
  <style lang="scss" scoped>
.menu-list{
        width: 200px;
        text-align: left;
        background-color: rgba(0,0,0,0) !important;
        border: 1px solid rgba(0, 241, 251, 0.3);
        margin: 20px 0 20px 20px;
        .text{
            font-size: 14px;
            color: #FFFFFF;
            text-shadow: 0px 8px 10px rgba(14,23,47,0.56);
            background: linear-gradient(180deg, #FFFFFF 0.537109375%, #89EBF4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .list{
            width: 100%;
            display: flex;
            align-items: center;
            padding: 5px 20px;
            position: relative;
            // background: rgba(0,241,251,0.3);
            background-color: #14334D;
            border-top: 1px solid #00F1FB;
            >div:nth-child(3){
                width: 20px;
            }
        }
        i{
            color: #00F1FB;
            margin-right: 5px;
            transition: .3s ease-in-out;
            font-size: 15px;
            position: relative;
            top:-1px;
        }

        .list-children{
            >div{
                transition: .3s;
                >div{
                    height: 40px;
                    line-height: 40px;
                    font-size: 12px;
                    color: #CFE3FF;
                    // border-right: 5px solid rgba(0,0,0,0);
                    border-bottom: 1px solid #3E899D;
                    display: flex;
                    align-items: center;
                    >span{
                        display: inline-block;
                        width: 5px;
                        height: 5px;
                        background-color: #CFE3FF;
                        margin: 0 10px 0 50px;
                    }
                }
                >div:nth-last-child(1){
                    border-bottom:0;
                }
                >div:hover{
                    color: #00E4FF;
                    background-image: url(@/assets/image/menu-bg.png);
                    background-size: 100% 100%;
                    span{
                        background-color: #00E4FF;
                    }
                }
                div.action{
                    color: #00E4FF;
                    background-image: url(@/assets/image/menu-bg.png);
                    background-size: 100% 100%;
                    span{
                        background-color: #00E4FF;
                    }
                }
            }

            overflow: hidden;
        }
    }
  </style>