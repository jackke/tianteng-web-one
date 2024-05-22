<template>
    <div class="mars-pagination">
        <el-pagination 
            @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" 
            :pager-count="pagerCount" :page-size="pageSize" :layout="layout" :total="total"> 
        </el-pagination>
    </div>
  </template>
  <script>
    import CommonTitle from '../components/CommonTitle'
 
    export default {
        name: "marsPagination", // 分页组件
        components: { CommonTitle, },
        props:{
            // currentPage:{ // 当前页
            //     type: Number,
            //     default: 1,
            // },
            pageSize:{ // 当前展示多少条
                type: Number,  
                default: 10,
            },
            pagerCount:{ // 总页数，显示几页 其余...显示
                type: Number,
                default: 5,
            },
            total:{ //总条数
                type: Number,
                default: 0,
            },
            layout:{ //分页展示类型
                type: String,
                default: 'total, sizes, prev, pager, next, jumper',
            },
            
    },
    data () {
      return {
        tagTypeValue: 0,
        currentPage: 1,
      };
    },
    mounted() {
        this.$nextTick(() =>    {
            let classIconRight = document.getElementsByClassName('el-icon el-icon-arrow-right')
            let classIconLeft = document.getElementsByClassName('el-icon el-icon-arrow-left')
            // console.log(document.getElementsByClassName('el-icon el-icon-arrow-right')[0]); 
            classIconRight[0].className = 'el-icon el-icon-caret-right'
            classIconLeft[0].className = 'el-icon el-icon-caret-left'
        })
    },
    methods: {
        // pageSize 改变时会触发 每页条数
        handleSizeChange(size){
            this.$emit('size-change', size)
        },
        // currentPage 改变时会触发	当前页
        handleCurrentChange(page){
            this.$emit('current-change', page)
        }
    }
  }
  </script>
  <style lang="scss" scoped>
    .mars-pagination{
        color: #fff;
        font-size: 20px;
        text-align: end;
        // 分页 样式
        /deep/ .el-pagination .btn-prev, /deep/ .el-pagination .btn-next, /deep/ .el-pager li {
            background-color: unset;
        }
        /deep/ .el-pager li{
            min-width: 26px;
            color: rgba(#00F0FF, .6);
        }
        /deep/ .el-pagination__jump, /deep/ .el-pagination .el-icon{
            color: rgba(#00F0FF, .6);
        }
        /deep/ .el-pagination .el-icon{
            color: rgba(#00F0FF, .6);
            font-size: 20px;
        }
        /deep/ .el-pager li.active{
            color: rgba(#00F0FF, .6);
            font-weight: 800;
            position: relative;
            // border: 3px solid rgba(#00F0FF, .6);
            // border-radius: 3px;
        }
        /deep/ .el-pager li.active::after{
            content: "";
            position: absolute;
            left: -3px;
            top: -3px;
            width: 100%;
            height: 100%;
            border: 3px solid rgba(#00F0FF, .6);
            border-radius: 3px;
        }
        /deep/ .el-input__inner{
            color: rgba(#00F0FF, .8);
            background-color: #0D1E36;
            border-color: rgba(#00F0FF, .8);
        }
        /deep/ .el-pagination__total{
            color: rgba(#00F0FF, .8);
        }

    }
  </style>