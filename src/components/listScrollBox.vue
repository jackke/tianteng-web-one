<template>
    <div class="listScrollBox">
        <div class="listSlot">
            <slot></slot>
        </div>
    </div>
  </template>
  <script>
  import $ from 'jquery'
    export default {
        name: "listScrollBox", // 分页组件
        components: {},
        props:{
            per:{
                type: Number,
                default: 0.3,
            }
        },
        data () {
            return {
                actionIndex: 0,
            };
        },
        mounted() {
            let that = this
            that.setScale()
            /*窗口改变事件*/
            $(window).resize(() => {
                that.setScale()
            });
        },
        methods: {
            setScale(){
                let per = window.innerHeight * this.per
                let height = window.innerHeight - per
                // $('.listScrollBox .listSlot')[0].style = `height:${height}px; overflow:auto;`
                let documentAll = $('.listScrollBox .listSlot')
                for (let index = 0; index < documentAll.length; index++) {
                    documentAll[index].style = `height:${height}px; overflow:auto;`;
                }
                // console.log($('.listScrollBox .listSlot'));
            }
        }
  }
  </script>
  <style lang="scss" scoped>

  </style>